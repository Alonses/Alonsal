const { verifica_warns } = require("./warn")
const { verifica_eraser } = require("./guild_eraser")
const { requisita_modulo, atualiza_modulos } = require("./module")
const { verifica_servers } = require("../data/ranking")
const { verifica_user_eraser } = require("./user_eraser")

const sync_dynamic_badges = require("./dynamic_badges")

module.exports = async ({ client }) => {

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    atualiza_modulos(client)
    console.log("📣 | Disparando o relógio interno")

    setTimeout(() => internal_clock(client, tempo_restante), 5000)
}

internal_clock = (client, tempo_restante) => {

    setTimeout(() => { // Sincronizando os dados do bot

        // Verificando se há modulos para o horário atual
        requisita_modulo()
        verifica_warns(client) // Sincronizando as advertências que se expirão

        if (client.timestamp() % 600 < 60) {
            sync_dynamic_badges(client) // Sincronizando as badges que são dinâmicas
            verifica_eraser(client) // Verificando se há dados de servidores que se expiraram
            verifica_user_eraser(client) // Verificando se há dados de usuários que se expiraram
        }

        if (client.timestamp() % 1800 < 60)
            verifica_servers() // Sincronizando o ranking global dos usuários que ganharam XP

        internal_clock(client, 60000)
    }, tempo_restante)
}