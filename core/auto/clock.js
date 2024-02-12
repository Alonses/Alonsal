const { requisita_modulo, atualiza_modulos } = require("./module")
const { atualiza_warns, verifica_warns } = require("./warn")
const { atualiza_eraser, verifica_eraser } = require("./guild_eraser")

module.exports = async ({ client }) => {

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    if (tempo_restante > 1000)
        console.log(`📣 | Disparando o relógio em ${tempo_restante} segundos`)
    else
        console.log(`📣 | Disparando o relógio agora!`)

    if (client.x.modules)
        atualiza_modulos(client)

    atualiza_warns(client)
    atualiza_eraser(client)

    setTimeout(() => internal_clock(client, tempo_restante), 5000)
}

internal_clock = (client, tempo_restante) => {

    setTimeout(() => {

        if (client.x.modules) // Sincronizando os módulos ativos
            requisita_modulo()

        verifica_warns(client) // Sincronizando as advertências que se expirão
        verifica_eraser(client) // Verificando se há dados que se expiraram
        internal_clock(client, 60000)
    }, tempo_restante)
}