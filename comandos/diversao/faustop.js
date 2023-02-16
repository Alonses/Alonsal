const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { readdirSync } = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faustop")
        .setDescription("⌠😂⌡ Faustão\'s phrases")
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Frases do faustão',
            "es-ES": '⌠😂⌡ Las frases de Faustão',
            "fr": '⌠😂⌡ Les phrases de Faustão',
            "it": '⌠😂⌡ Le frasi di Faustão',
            "ru": '⌠😂⌡ Фразы от Faustão'
        }),
    async execute(client, user, interaction) {

        let i = 0

        for (const file of readdirSync(`./arquivos/songs/faustop`).filter(file => file.endsWith('.ogg')))
            i++

        const data = new Date()
        let num = Math.round((i - 1) * Math.random())

        if (data.getHours() == 20 && data.getMinutes() == 7)
            num = Math.round(1 + (1 * Math.random())) > 1 ? 7 : 12;

        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${num}.ogg`, { name: 'faustop.ogg' })

        return interaction.reply({ files: [file], ephemeral: user?.conf.ghost_mode || false })
    }
}