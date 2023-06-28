let express = require("express")
let cors = require("cors")

const { default: axios } = require("axios")
const main = require("./database/config")
const model = require("./database/model")
require('dotenv').config()
let PORT = process.env.PORT

let app = express()

app.use(express.json())
app.use(cors())

//API for initialize data
app.get('/api/initialize_database', async (req, res) => {
    try {
        let response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`)
        let data = response.data
        data = await model.create(data)
        res.json({ initializedata: data })
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Failed to initialize database' });
    }
})


//API for return all transaction

app.get('/api/transaction', async (req, res) => {
    try {
        let { search, page = 1, perPage = 10, month } = req.query
        let query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },

                    ]
                },
                {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, month]
                    }
                }
            ]
        }
        if (!isNaN(search)) {
            query = {
                $and: [
                    {
                        $or: [
                            { price: { $eq: search } }
                        ]
                    },
                    {
                        $expr: {
                            $eq: [{ $month: '$dateOfSale' }, month]
                        }
                    }
                ]
            }
        }
        if (search === "") {

            query = {
                $expr: {
                    $eq: [{ $month: '$dateOfSale' }, month]
                }
            }
        }

        if (month == 0) {
            if (search === "") {
                query = null
            } else {
                query = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },

                    ]
                }
            }
        }


        let data = await model.find(query).limit(perPage).skip((perPage * page) - 10)
        res.json({ transactions: data })
    } catch (error) {
        console.error('Error to response your query', error);
        res.status(500).json({ error: 'Failed to response your query' });
    }
})

//API for statistics

app.get('/api/statistics', async (req, res) => {
    try {
        const { month } = req.query;
        let query = {
            sold: true,
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, month]
            }
        }
        let soldItems = await model.find(query).count()


        let totalSaleAmount = 0
        await (await model.find(query)).forEach((el) => {
            totalSaleAmount += el.price
        })


        query = {
            sold: false,
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, month]
            }
        }
        let unsoldItems = await model.find(query).count()




        res.json({ totalSaleAmount: totalSaleAmount, soldItems: soldItems, unsoldItems: unsoldItems });
    } catch (error) {
        console.error('Error to response your query', error);
        res.status(500).json({ error: 'Failed to response your query' });
    }
})

//API for pieChart

app.get('/api/pie_chart', async (req, res) => {
    try {
        const { month } = req.query;
        let query = [
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]
        let result = await model.aggregate(query)
        res.json({ piechart: result })



    } catch (err) {
        console.error('Error to response your query', err);
        res.status(500).json({ error: 'Failed to response your query' });
    }
})


// API for  barChart

app.get('/api/bar_chart', async (req, res) => {

    try {
        const { month } = req.query;
        let query = [
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
                    }
                }
            },
            {
                $facet: {
                    priceRanges: [
                        {
                            $bucket: {
                                groupBy: '$price',
                                boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901, Infinity],
                                output: {
                                    count: { $sum: 1 }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$priceRanges'
            },
            {
                $project: {
                    _id: 0,
                    priceRange: '$priceRanges._id',
                    count: { $ifNull: ["$priceRanges.count", 0] }
                }
            }
        ]

        const result = await model.aggregate(query);



        res.json({ barchart: result })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//API for combined data

app.get('/api/combined_data', async (req, res) => {
    const { month } = req.query;

    try {
        const statistics = await axios.get(`http://localhost:${PORT}/api/statistics?month=${month}`);
        const piechart = await axios.get(`http://localhost:${PORT}/api/pie_chart?month=${month}`);
        const barchart = await axios.get(`http://localhost:${PORT}/api/bar_chart?month=${month}`);

        const combinedData = {
            statistics: statistics.data,
            pieChart: piechart.data,
            barChart: barchart.data,
        };

        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
})










app.listen(PORT, () => {
    main()
    console.log('server listen to' + PORT)
})