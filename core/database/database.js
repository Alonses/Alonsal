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
        console.error("🔴 | Erro ao conectar no Banco")
        console.error(err)
        process.exit(1)
    }
}

mongoose.connection.on('error', err => {
    console.error("🔴 | Um erro ocorreu no Banco de dados")
    console.error(err)
})

module.exports.setup = setup