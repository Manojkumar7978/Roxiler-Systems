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
    const { month } = req.query;
    let query = {
        sold: true,
        $expr: {
            $eq: [{ $month: '$dateOfSale' }, month]
        }
    }
    let soldItems = await model.find(query).count()

    query = {
        sold: false,
        $expr: {
            $eq: [{ $month: '$dateOfSale' }, month]
        }
    }
    let unsoldItems = await model.find(query).count()

    query = {
        sold: true,
        $expr: {
            $eq: [{ $month: '$dateOfSale' }, month]
        }
    }
    // let sum = 0;
    let totalSaleAmount = 0
    await (await model.find(query)).forEach((el) => {
        totalSaleAmount += el.price
    })

    res.json({ totalSaleAmount: totalSaleAmount, soldItems: soldItems, unsoldItems: unsoldItems });
});


app.listen(PORT, () => {
    main()
    console.log('server listen to' + PORT)
})