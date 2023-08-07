const { SlashCommandBuilder } = require('discord.js')

const { createStatement } = require('../../adm/database/schemas/Statement')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coin")
        .setDescription("⌠🎲⌡ Play heads or tails")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Jogue cara ou coroa',
            "es-ES": '⌠🎲⌡ Juega cara o cruz',
            "fr": '⌠🎲⌡ Jouez à pile ou face',
            "it": '⌠🎲⌡ Gioca testa o croce',
            "ru": '⌠🎲⌡ Играть орлом или решкой'
        })
        .addStringOption(option =>
            option.setName("choise")
                .setNameLocalizations({
                    "pt-BR": 'escolha',
                    "es-ES": 'eleccion',
                    "fr": 'choix',
                    "it": 'scelta',
                    "ru": 'выбор'
                })
                .setDescription("Heads or tails?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Cara ou coroa?',
                    "es-ES": '¿Cara o cruz?',
                    "fr": 'Pile ou face?',
                    "it": 'Testa o croce?',
                    "ru": 'Орел или решка?'
                })
                .addChoices(
                    { name: '🟡', value: '0' },
                    { name: '👑', value: '1' }
                )
                .setRequired(true))
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
                })
                .setMinValue(0.01)
                .setMaxValue(200)),
    async execute(client, user, interaction) {

        const escolha = parseInt(interaction.options.getString("choise"))
        const bet = interaction.options.getNumber("bet") ?? 0

        if (bet && bet > user.misc.money) // Sem Bufunfas para poder apostar
            return client.tls.reply(interaction, user, "game.jokenpo.erro_aposta", true, [9, 4])

        const moeda = Math.round(Math.random())
        let emoji_exib = ":coin:", profit = bet

        if (moeda === 1)
            emoji_exib = ":crown:"

        let resultado = `[ ${emoji_exib} ] ${client.tls.phrase(user, "game.cara.acertou")} ${client.emoji(emojis_dancantes)}\n[Lucro: \`B$ ${profit}\`]`

        if (escolha !== moeda) { // Errou
            profit = -bet
            resultado = `[ ${emoji_exib} ] ${client.tls.phrase(user, "game.cara.errou")} ${client.emoji("epic_embed_fail2")}\n[Lucro: \`B$ ${profit}\`]`
        }

        user.misc.money += profit
        await user.save()

        // Registrando as movimentações de bufunfas para o usuário
        if (profit > 0)
            await createStatement(user.uid, `Jogos e entretenimento (cara ou coroa)`, true, profit, client.timestamp())
        else if (profit < 0)
            await createStatement(user.uid, `Jogos e entretenimento (cara ou coroa)`, false, profit * -1, client.timestamp())

        interaction.reply({ content: resultado, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }
}