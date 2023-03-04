const mongoose = require("mongoose")

function setup(uri) {
    mongoose.set('strictQuery', true)
    mongoose.connect(uri)
    var database = mongoose.connection
}

module.exports = {
    setup
}