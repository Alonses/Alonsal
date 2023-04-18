const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ceira")
		.setDescription("⌠😂⌡ Waxed Java")
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Java enceirado',
			"es-ES": '⌠😂⌡ Java encerado',
			"fr": '⌠😂⌡ Java ciré',
			"it": '⌠😂⌡ Java cerato',
			"ru": '⌠😂⌡ Вощеная Ява'
		}),
	async execute(client, user, interaction) {
		const ceira = new AttachmentBuilder("./arquivos/img/ceira.png")
		interaction.reply({ content: "Press :regional_indicator_f: :pensive: :fist:", files: [ceira], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
	}
}