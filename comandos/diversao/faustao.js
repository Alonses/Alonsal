const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { readdirSync } = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('faustop')
        .setDescription('⌠😂⌡ Faustão\'s phrases')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Frases do faustão',
            "es-ES": '⌠😂⌡ Las frases de Faustão',
            "fr": '⌠😂⌡ Les phrases de Faustão',
            "it": '⌠😂⌡ Le frasi di Faustão'
        }),
    async execute(client, interaction) {

        let i = 0

        for (const file of readdirSync(`./arquivos/songs/faustop`).filter(file => file.endsWith('.mp3')))
            i++

        const num = Math.round((i - 1) * Math.random())
        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${num}.mp3`, { name: 'faustop.mp3' })
        return interaction.reply({ files: [file] })
    }
}