
// const formata_clima = require('../formatadores/formata_clima')

module.exports = async ({ client }) => {

    if (!client.x.modules) return

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = (10 - date1.getSeconds()) * 1000

    console.log(`Disparando modulos em ${tempo_restante / 1000} segundos`)

    setTimeout(() => {
        requisita_modulo(client)
        verifica_modulo(client, 60000)
    }, tempo_restante) // Executa de 60 em 60 segundos
}

function verifica_modulo(client, tempo_restante) {

    setTimeout(() => {
        requisita_modulo(client)
        verifica_modulo(client, 60000)
    }, tempo_restante)
}

async function requisita_modulo(client) {
    console.log("Disparando modulos")

    // const user = await client.getUser('')

    // formata_clima(client, user, null, 1)
}