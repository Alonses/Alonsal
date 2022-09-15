const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ceira')
		.setDescription('⌠😂⌡ Waxed Java')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Java enceirado',
			"es-ES": '⌠😂⌡ Java encerado',
			"fr": '⌠😂⌡ Java ciré'
		}),
	async execute(client, interaction) {
		const ceira = new AttachmentBuilder('./arquivos/img/ceira.png')
		interaction.reply({ content: "Press :regional_indicator_f: :pensive: :fist:", files: [ceira] })
	}
}