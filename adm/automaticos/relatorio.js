const { getBot } = require("../database/schemas/Bot")

module.exports = async ({ client, caso, quantia }) => {

    const bot = await getBot(client.id())

    // Movimentações de bufunfas
    if (caso === "gerado" || caso === "movido" || caso === "reback") {

        if (caso === "gerado")
            bot.bfu.gerado += quantia

        if (caso === "movido")
            bot.bfu.movido += quantia

        if (caso === "reback")
            bot.bfu.movido += quantia

    } else {

        if (caso === "messages") {
            bot.exp.exp_concedido += bot.persis.ranking
            bot.exp.msgs_validas += 1
            bot.exp.msgs_lidas += 1
        }

        if (caso === "comando") {
            bot.exp.exp_concedido += bot.persis.ranking * 1.5
            bot.cmd.ativacoes += 1
            bot.exp.msgs_lidas += 1
            bot.exp.msgs_validas += 1
        }

        if (caso === "msg_enviada")
            bot.exp.msgs_lidas += 1

        if (caso === "epic_embed")
            bot.cmd.erros += 1
    }

    await bot.save()
}