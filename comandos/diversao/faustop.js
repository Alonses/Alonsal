const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const create_menus = require('../../adm/discord/create_menus.js')

const { relation } = require('../../arquivos/songs/faustop/songs.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faustop")
        .setDescription("⌠😂⌡ Faustão\'s phrases")
        .addSubcommand(subcommand =>
            subcommand
                .setName("fala")
                .setDescription("⌠😂|🇧🇷⌡ Invoca uma fala aleatória do faustão"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("menu")
                .setDescription("⌠😂|🇧🇷⌡ Escolha uma fala do faustão")),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "menu") {

            const data = new Date()
            let num = client.random(client.countFiles("./arquivos/songs/faustop", "ogg") - 1)

            if (data.getHours() === 20 && data.getMinutes() === 7)
                num = client.random(1, 1) > 1 ? 7 : 12

            const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${num}.ogg`, { name: "faustop.ogg" })

            interaction.reply({ files: [file], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
        } else
            interaction.reply({ content: ":mega: | Escolha uma das frases abaixo!", components: [create_menus("fausto", client, interaction, user, relation)], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    }
}