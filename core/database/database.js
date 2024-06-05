const mongoose = require("mongoose")

async function setup(uri) {
    mongoose.set('strictQuery', true)
    await mongoose.connect(uri)

    var database = mongoose.connection
}

module.exports = {
    setup
}