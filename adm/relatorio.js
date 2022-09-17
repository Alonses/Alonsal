const { existsSync, writeFileSync } = require('fs')
const fs = require('fs')

let trava_edicao = 0

module.exports = async ({ client, caso }) => {

    if (trava_edicao === 1) return
    trava_edicao = 1

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        msgs_validas: 0,
        epic_embed_fails: 0
    }

    if (existsSync(`./arquivos/data/relatorio.json`)) {
        delete require.cache[require.resolve(`../arquivos/data/relatorio.json`)]
        try {
            const { comandos_disparados, exp_concedido, msgs_lidas, msgs_validas, epic_embed_fails } = require(`../arquivos/data/relatorio.json`)
            bot.comandos_disparados = comandos_disparados
            bot.exp_concedido = exp_concedido
            bot.msgs_lidas = msgs_lidas
            bot.msgs_validas = msgs_validas
            bot.epic_embed_fails = epic_embed_fails
        } catch (err) {
            bot.comandos_disparados = 0
            bot.exp_concedido = 0
            bot.msgs_lidas = 0
            bot.msgs_validas = 0
            bot.epic_embed_fails = 0

            client.channels.cache.get('872865396200452127').send(":scroll: | Houve um erro no relatório e ele foi reiniciado, chora")
        }
    }

    fs.readFile('./arquivos/data/rank_value.txt', 'utf8', function (err, data) {

        if (caso === "messages") {
            bot.exp_concedido += parseFloat(data)
            bot.msgs_validas += 1
            bot.msgs_lidas += 1
        }

        if (caso === "comando") {
            bot.exp_concedido += (parseFloat(data) * 1.5)
            bot.comandos_disparados += 1
            bot.msgs_lidas += 1
            bot.msgs_validas += 1
        }

        if (caso === "msg_enviada")
            bot.msgs_lidas += 1

        if (caso === "epic_embed")
            bot.epic_embed_fails += 1

        writeFileSync(`./arquivos/data/relatorio.json`, JSON.stringify(bot))
        delete require.cache[require.resolve(`../arquivos/data/relatorio.json`)]

        trava_edicao = 0
    })
}