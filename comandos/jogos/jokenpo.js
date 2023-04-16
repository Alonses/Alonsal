const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jokenpo")
        .setDescription("⌠🎲⌡ Play jokenpo")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Jogue jokenpô',
            "es-ES": '⌠🎲⌡ Juega jokenpo',
            "fr": '⌠🎲⌡ Jouer au jokenpo',
            "it": '⌠🎲⌡ Gioca a jokenpo',
            "ru": '⌠🎲⌡ Играть в Джокенпо'
        })
        .addStringOption(option =>
            option.setName("choose")
                .setNameLocalizations({
                    "pt-BR": 'escolha',
                    "es-ES": 'eleccion',
                    "fr": 'choix',
                    "it": 'scelta',
                    "ru": 'выбор'
                })
                .setDescription("What's your choice?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual a sua escolha?',
                    "es-ES": '¿Cual es tu eleccion?',
                    "fr": 'Quel est ton choix?',
                    "it": 'Qual\'è la tua scelta?',
                    "ru": 'Каков ваш выбор?'
                })
                .addChoices(
                    { name: '🗿', value: 'pedra' },
                    { name: '🧻', value: 'papel' },
                    { name: '✂️', value: 'tesoura' }
                ))
        .addNumberOption(option =>
            option.setName('bet')
                .setNameLocalizations({
                    "pt-BR": 'aposta',
                    "es-ES": 'apuesta',
                    "fr": 'pari',
                    "it": 'scommessa'
                })
                .setDescription('The amount to bet')
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantia que sera apostada',
                    "es-ES": 'La cantidad a apostar',
                    "fr": 'Le montant à miser',
                    "it": 'L\'importo da scommettere'
                })),
    async execute(client, user, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        let jooj = ["pedra", "papel", "tesoura", "pedra"]

        const escolha = interaction.options.getString("choose")
            ?? jooj[client.random(2)]

        const bet = interaction.options.getNumber("bet") ?? 0
        if (bet && bet > user.misc.money) return interaction.reply("Pague o aluguel")

        const emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"]

        let player = jooj.indexOf(escolha)
        let bot = client.random(2), ganhador = ":thumbsdown:", profit = -bet

        if (player === 0) player = 3
        if (bot === 0) bot = 3
        if (player === 3 && bot === 1) player = 0

        if (bot < player || (player === 1 && bot === 3)) {
            ganhador = ":trophy:"
            profit = bet
        }

        if (bot === player) {
            ganhador = ":infinity:"
            profit = 0
        }

        let mensagem = `Jokenpô! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- Você\n[ ${ganhador} ]\n[Lucro: B$${profit}]`

        if (idioma_definido !== "pt-br" && idioma_definido !== "al-br")
            mensagem = `Jokenpo! \n[ ${emojis[bot]} ] Bot\n[ ${emojis[player]} ] <- You\n[ ${ganhador} ]\n[Profit: B$${profit}]`

        user.misc.money += profit
        user.save()

        interaction.reply({ content: mensagem, ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    }
}