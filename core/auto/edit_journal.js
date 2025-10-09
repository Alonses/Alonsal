module.exports = async ({ client, caso, quantia }) => {

    if (!client.x.relatorio) return

    const bot = await client.getBot()
    quantia = parseFloat(quantia)

    if (isNaN(quantia)) return

    // Movimentações de bufunfas
    if (caso === "gerado" || caso === "movido" || caso === "reback") {
        bot.bfu[caso] += quantia

        if (caso === "gerado") // Salvando as Bufunfas geradas no histórico global
            bot.persis.bufunfas += quantia
    } else {

        if (caso === "messages") {
            bot.exp.exp_concedido += bot.persis.ranking
            bot.exp.msgs_validas += 1
            bot.exp.msgs_lidas += 1
        }

        if (caso === "comando") {
            bot.exp.exp_concedido += bot.persis.ranking * 1.5
            bot.cmd.ativacoes += 1
        }

        if (caso === "botao") {
            bot.exp.exp_concedido += bot.persis.ranking * 0.5
            bot.cmd.botoes += 1
        }

        if (caso === "menu") {
            bot.exp.exp_concedido += bot.persis.ranking * 0.5
            bot.cmd.menus += 1
        }

        if (caso === "msg_enviada")
            bot.exp.msgs_lidas += 1

        if (caso === "epic_embed")
            bot.cmd.erros += 1

        if (caso === "voice_channel")
            bot.cmd.voice_channels += 1
    }

    await bot.save()
}