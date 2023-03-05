const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alaa")
        .setDescription("⌠😂|🇧🇷⌡ Funfo?"),
    async execute(client, user, interaction) {
        const file = new AttachmentBuilder("./arquivos/songs/alaa.ogg")
        interaction.reply({ files: [file], ephemeral: user?.conf.ghost_mode || false })
    }
}