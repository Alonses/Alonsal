const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ceira")
		.setDescription("⌠😂⌡ Waxed Java")
		.setDescriptionLocalizations({
			"de": '⌠😂⌡ Java-Wachs',
			"es-ES": '⌠😂⌡ Java encerado',
			"fr": '⌠😂⌡ Java ciré',
			"it": '⌠😂⌡ Java cerato',
			"pt-BR": '⌠😂⌡ Java enceirado',
			"ru": '⌠😂⌡ Вощеная Ява'
		}),
	async execute({ client, user, interaction, user_command }) {

		const ceira = new AttachmentBuilder("./files/img/ceira.png")
		interaction.reply({
			content: "Press :regional_indicator_f: :pensive: :fist:",
			files: [ceira],
			ephemeral: client.decider(user?.conf.ghost_mode || user_command, 0)
		})
	}
}