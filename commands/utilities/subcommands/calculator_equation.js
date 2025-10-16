const math = require('mathjs')
const { isInteger } = require('mathjs')

module.exports = async ({ client, user, interaction }) => {

    const expressao = interaction.options.getString("equation")

    await client.deferedReply(interaction, client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null)

    if (expressao.length < 2)
        return client.tls.editReply(interaction, user, "util.calc.aviso_1")

    try {
        let resultado = math.evaluate(expressao)
        let emoji_res = "📈"

        if (resultado < 0)
            emoji_res = "📉"

        if (!isInteger(resultado))
            resultado = resultado.toFixed(6)

        return client.reply(interaction, {
            content: `${client.tls.phrase(user, "util.calc.resultado", emoji_res)}: \`${client.execute("locale", { valor: resultado })}\``,
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        }, true)
    } catch {
        return interaction.editReply({
            content: `${client.tls.phrase(user, "util.calc.error", client.emoji(0))}: \`${expressao}\``,
            flags: "Ephemeral"
        })
    }
}