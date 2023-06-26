const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    sold: { type: Boolean },
    dateOfSale: { type: Date }

})


let model = mongoose.model('products', schema)

module.exports = model
