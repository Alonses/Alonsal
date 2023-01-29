const { SlashCommandBuilder } = require('discord.js')

const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('⌠🎲⌡ Play heads or tails')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Jogue cara ou coroa',
            "es-ES": '⌠🎲⌡ Juega cara o cruz',
            "fr": '⌠🎲⌡ Jouez à pile ou face',
            "it": '⌠🎲⌡ Gioca testa o croce'
        })
        .addStringOption(option =>
            option.setName('choise')
                .setNameLocalizations({
                    "pt-BR": 'escolha',
                    "es-ES": 'eleccion',
                    "fr": 'choix',
                    "it": 'scelta'
                })
                .setDescription('Heads or tails?')
                .setDescriptionLocalizations({
                    "pt-BR": 'Cara ou coroa?',
                    "es-ES": '¿Cara o cruz?',
                    "fr": 'Pile ou face?',
                    "it": 'Testa o croce?'
                })
                .addChoices(
                    { name: '🟡', value: '0' },
                    { name: '👑', value: '1' }
                )
                .setRequired(true)),
    async execute(client, user, interaction) {

        const escolha = parseInt(interaction.options.data[0].value)

        const moeda = Math.round(Math.random())
        let emoji_exib = ":coin:"

        if (moeda === 1)
            emoji_exib = ":crown:"

        let resultado = `[ ${emoji_exib} ] ${client.tls.phrase(user, "game.cara.acertou")} ${client.emoji(emojis_dancantes)}`

        if (escolha !== moeda) // Errou
            resultado = `[ ${emoji_exib} ] ${client.tls.phrase(user, "game.cara.errou")} ${client.emoji(emojis.epic_embed_fail2)}`

        return interaction.reply(resultado)
    }
}