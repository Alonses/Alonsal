const math = require('mathjs')
const { isInteger } = require('mathjs')

module.exports = async ({ client, user, interaction }) => {

    const expressao = interaction.options.getString("equation")

    if (expressao.length < 2)
        return client.tls.reply(interaction, user, "util.calc.aviso_1")

    try {
        let resultado = math.evaluate(expressao)
        let emoji_res = "📈"

        if (resultado < 0)
            emoji_res = "📉"

        if (!isInteger(resultado))
            resultado = resultado.toFixed(6)

        interaction.reply({ content: `${client.tls.phrase(user, "util.calc.resultado", emoji_res)}: \`${client.locale(resultado)}\``, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    } catch {
        interaction.reply({ content: `${client.tls.phrase(user, "util.calc.error", 0)}: \`${expressao}\``, ephemeral: true })
    }
}