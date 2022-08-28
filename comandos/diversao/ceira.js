const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ceira')
		.setDescription('⌠😂⌡ Java enceirado'),
	async execute(client, interaction) {
        const ceira = new AttachmentBuilder('./arquivos/img/ceira.png')
        interaction.reply({ content: "Press :regional_indicator_f: :pensive: :fist:", files: [ceira] })
    }
}