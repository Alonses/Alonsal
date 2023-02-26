const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { readdirSync } = require('fs')
const create_menus = require('../../adm/discord/create_menus.js')

const { relation } = require('../../arquivos/songs/faustop/songs.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faustop")
        .setDescription("⌠😂⌡ Faustão\'s phrases")
        .addSubcommand(subcommand =>
            subcommand
                .setName("rand")
                .setDescription("⌠😂|🇧🇷⌡ Invoca uma frase aleatória do faustão"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("menu")
                .setDescription("⌠😂|🇧🇷⌡ Escolher uma frase do faustão")),
    async execute(client, user, interaction) {

        let i = 0

        if (interaction.options.getSubcommand() !== "menu") {
            for (const file of readdirSync(`./arquivos/songs/faustop`).filter(file => file.endsWith('.ogg')))
                i++

            const data = new Date()
            let num = Math.round((i - 1) * Math.random())

            if (data.getHours() === 20 && data.getMinutes() === 7)
                num = Math.round(1 + (1 * Math.random())) > 1 ? 7 : 12;

            const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${num}.ogg`, { name: 'faustop.ogg' })

            return interaction.reply({ files: [file], ephemeral: user?.conf.ghost_mode || false })
        } else
            return interaction.reply({ content: 'Escolha uma das frases abaixo!', components: [create_menus("fausto", client, interaction, user, relation)], ephemeral: user?.conf.ghost_mode || false })
    }
}