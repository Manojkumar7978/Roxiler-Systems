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
        let { search, page = 1, perPage = 10 } = req.query
        const query = {
            $or: [
                { price: { $eq: search } },
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },

            ]
        }
        let data = await model.find(query).limit(perPage).skip((perPage * page) - 10)
        res.send({ transactions: data })
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
});

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
        res.send({ piechart: result })



    } catch (err) {
        console.error('Error to response your query', err);
        res.status(500).json({ error: 'Failed to response your query' });
    }
});


// API for  barChart

app.get('/api/bar-chart', async (req, res) => {

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



        res.send({ barchart: result })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});









app.listen(PORT, () => {
    main()
    console.log('server listen to' + PORT)
})