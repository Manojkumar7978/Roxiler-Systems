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


// app.get('/api/initialize-database', async (req, res) => {
//     try {
//         let response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`)
//         let data = response.data
//         data = await model.create(data)
//         res.send(data)
//     } catch (error) {
//         console.error('Error initializing database:', error);
//         res.status(500).json({ error: 'Failed to initialize database' });
//     }
// })


app.listen(PORT, () => {
    main()
    console.log('server listen to' + PORT)
})