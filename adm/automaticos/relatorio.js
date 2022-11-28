const fs = require('fs')

let trava_edicao = 0

module.exports = async ({ client, caso, quantia }) => {

    if (trava_edicao === 1) return
    trava_edicao = 1

    // Coletando os dados do bot
    const bot = client.auto.getRelatorio()

    // Movimentações de dinheiro pelo bot
    if (caso === "bufunfa" || caso === "movimentacao") {

        if (caso === "bufunfa")
            bot.bufunfas += quantia

        if (caso === "movimentacao")
            bot.movimentado += quantia

        client.auto.saveRelatorio(bot)
        trava_edicao = 0
    } else {

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

            client.auto.saveRelatorio(bot)
            trava_edicao = 0
        })
    }
}