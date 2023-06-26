const mongoose = require('mongoose');
require('dotenv').config()


async function main() {
    console.log('database connected')
    await mongoose.connect(process.env.MONGO_URL);

}

module.exports = main