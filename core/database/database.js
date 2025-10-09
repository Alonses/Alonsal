const mongoose = require("mongoose")

async function setup(uri) {

    mongoose.set('strictQuery', false)

    const options = {
        maxPoolSize: 25, // Define o tamanho do pool de conexões
        socketTimeoutMS: 45000, // Tempo limite da conexão de 45 segundos
        connectTimeoutMS: 30000 // Tempo limite para conectar de 30 segundos
    }

    try {
        await mongoose.connect(uri, options)
        console.log("🟣 | Banco conectado")
    } catch (err) {
        console.log("🔴 | Erro ao conectar no Banco")
        console.log(err)
        process.exit(1)
    }
}

mongoose.connection.on('error', err => {
    console.log("🔴 | Um erro ocorreu no Banco de dados")
    console.log(err)
})

module.exports.setup = setup