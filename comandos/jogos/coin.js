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
    async execute(client, interaction) {

        const escolha = parseInt(interaction.options.data[0].value)
        const emoji_dancando = client.emoji(emojis_dancantes)

        const moeda = Math.round(Math.random())
        let emoji_exib = ":coin:"

        if (moeda === 1)
            emoji_exib = ":crown:"

        let resultado = `[ ${emoji_exib} ] ${client.tls.phrase(client, interaction, "game.cara.acertou")} ${emoji_dancando}`

        if (escolha !== moeda) { // Acertou
            const emoji_epic_embed_fail = client.emoji(emojis.epic_embed_fail2)
            resultado = `[ ${emoji_exib} ] ${client.tls.phrase(client, interaction, "game.coroa.errou")} ${emoji_epic_embed_fail}`
        }

        return interaction.reply(resultado)
    }
}