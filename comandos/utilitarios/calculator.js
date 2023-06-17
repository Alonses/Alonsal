const { SlashCommandBuilder } = require('discord.js')

const math = require('mathjs')
const { isInteger } = require('mathjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculator")
        .setNameLocalizations({
            "pt-BR": 'calculadora',
            "es-ES": 'calculadora',
            "fr": 'calculatrice',
            "it": 'calcolatrice',
            "ru": 'калькулятор'
        })
        .setDescription("⌠💡⌡ Find math problem results")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Ache resultados de problemas matemáticos',
            "es-ES": '⌠💡⌡ Encuentra los resultados de los problemas matemáticos',
            "fr": '⌠💡⌡ Trouver les résultats des problèmes mathématiques',
            "it": '⌠💡⌡ Trova i risultati dei problemi di matematica',
            "ru": '⌠💡⌡ Найдите результаты математических задач'
        })
        .addStringOption(option =>
            option.setName("equation")
                .setNameLocalizations({
                    "pt-BR": 'equação',
                    "es-ES": 'ecuacion',
                    "fr": 'equation',
                    "it": 'equazione',
                    "ru": 'уравнение'
                })
                .setDescription("Write something!")
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!',
                    "ru": 'Напиши что-нибудь!'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

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
}