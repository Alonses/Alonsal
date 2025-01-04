const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("esfiha")
		.setDescription("⌠😂⌡ Serve??")
		.setDescriptionLocalizations({
			"de": '⌠😂⌡ Serviert??',
			"es-ES": '⌠😂⌡ Servido??',
			"fr": '⌠😂⌡ Servi??',
			"it": '⌠😂⌡ Servito??',
			"pt-BR": '⌠😂⌡ Servidos??',
			"ru": '⌠😂⌡ Подали??'
		}),
	async execute({ client, user, interaction, user_command }) {

		interaction.reply({
			content: `${client.tls.phrase(user, "dive.esfiha")} :yum: :yum: :yum:\nhttps://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713`,
			flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
		})
	}
}