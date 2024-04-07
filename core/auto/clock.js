const { verifica_warns } = require("./warn")
const { requisita_modulo } = require("./module")
const { verifica_eraser } = require("./guild_eraser")
const { verifica_user_eraser } = require("./user_eraser")

const dynamic_badges = require("./dynamic_badges")

module.exports = async ({ client }) => {

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    console.log("📣 | Disparando o relógio interno")

    setTimeout(() => internal_clock(client, tempo_restante), 5000)
}

internal_clock = (client, tempo_restante) => {

    setTimeout(() => { // Sincronizando os dados do bot
        if (client.timestamp() % 600 < 60) {
            requisita_modulo()
            dynamic_badges(client)

            verifica_warns(client) // Sincronizando as advertências que se expirão
            verifica_eraser(client) // Verificando se há dados de servidores que se expiraram
            verifica_user_eraser(client) // Verificando se há dados de usuários que se expiraram
        }

        internal_clock(client, 60000)
    }, tempo_restante)
}