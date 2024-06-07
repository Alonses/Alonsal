const mongoose = require("mongoose")

async function setup(uri) {
    mongoose.set('strictQuery', false)
    mongoose.connect(uri)

    console.log("🟣 | Banco conectado")
    var database = mongoose.connection
}

module.exports.setup = setup