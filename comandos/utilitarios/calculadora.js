const { SlashCommandBuilder } = require('discord.js')

const math = require('mathjs')
const { isInteger, forEach } = require('mathjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setNameLocalizations({
            "pt-BR": 'calculadora',
            "es-ES": 'calculadora',
            "fr": 'calculatrice',
            "it": 'calcolatrice'
        })
        .setDescription('⌠💡⌡ Find math problem results')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Ache resultados de problemas matemáticos',
            "es-ES": '⌠💡⌡ Encuentra los resultados de los problemas matemáticos',
            "fr": '⌠💡⌡ Trouver les résultats des problèmes mathématiques',
            "it": '⌠💡⌡ Trova i risultati dei problemi di matematica'
        })
        .addStringOption(option =>
            option.setName('equation')
                .setNameLocalizations({
                    "pt-BR": 'equação',
                    "es-ES": 'ecuacion',
                    "fr": 'equation',
                    "it": 'equazione'
                })
                .setDescription('Write something!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        const expressao = interaction.options.data[0].value

        if (expressao.length < 2)
            return client.tls.reply(interaction, user, "util.calc.aviso_1")

        try {
            let resultado = math.evaluate(expressao)
            let emoji_res = ":chart_with_upwards_trend:"

            if (resultado < 0)
                emoji_res = ":chart_with_downwards_trend:"

            if (!isInteger(resultado))
                resultado = resultado.toFixed(6)

            interaction.reply({ content: `${emoji_res} | ${client.tls.phrase(user, "util.calc.resultado")}: \`${resultado.toLocaleString('pt-BR')}\``, ephemeral: true })
        } catch (err) {
            interaction.reply({ content: `:octagonal_sign: | ${client.tls.phrase(user, "util.calc.error")}: \`${expressao}\``, ephemeral: true })
        }
    }
}