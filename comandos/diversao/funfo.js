const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alaa')
        .setDescription('⌠😂|🇧🇷⌡ Funfo?'),
    async execute(client, interaction) {
        const file = new AttachmentBuilder('./arquivos/songs/alaa.mp3')
        return interaction.reply({ files: [file] })
    }
}