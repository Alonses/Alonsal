const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokenpo')
        .setDescription('⌠🎲⌡ Play jokenpo')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Jogue jokenpô',
            "es-ES": '⌠🎲⌡ Juega jokenpo',
            "fr": '⌠🎲⌡ Jouer au jokenpo',
            "it": '⌠🎲⌡ Gioca a jokenpo'
        })
        .addStringOption(option =>
            option.setName('choise')
                .setNameLocalizations({
                    "pt-BR": 'escolha',
                    "es-ES": 'eleccion',
                    "fr": 'choix',
                    "it": 'scelta'
                })
                .setDescription('What\'s your choice?')
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual a sua escolha?',
                    "es-ES": '¿Cual es tu eleccion?',
                    "fr": 'Quel est ton choix?',
                    "it": 'Qual\'è la tua scelta?'
                })
                .addChoices(
                    { name: '🗿', value: 'pedra' },
                    { name: '🧻', value: 'papel' },
                    { name: '✂️', value: 'tesoura' }
                )),
    async execute(client, user, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        let jooj = ["pedra", "papel", "tesoura", "pedra"], escolha
        
        if (interaction.options.data.length > 0)
            escolha = interaction.options.data[0].value.toLowerCase()

        const emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"]
        let player = Math.round(2 * Math.random())

        if (interaction.options.data.length > 0)
            player = jooj.indexOf(escolha)

        let bot = Math.round(2 * Math.random()), ganhador = ":thumbsdown:"

        if (player === 0) player = 3
        if (bot === 0) bot = 3

        if (player === 3 && bot === 1)
            player = 0

        if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:"
        if (bot === player) ganhador = ":infinity:"

        let mensagem = `Jokenpô! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- Você\n[ ${ganhador} ]`

        if (idioma_definido !== "pt-br" && idioma_definido !== "al-br")
            mensagem = `Jokenpo! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- You\n[ ${ganhador} ]`

        return interaction.reply(mensagem)
    }
}