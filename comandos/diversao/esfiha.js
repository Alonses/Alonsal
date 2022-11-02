const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('esfiha')
		.setDescription('⌠😂⌡ Serve??')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Servidos??',
			"es-ES": '⌠😂⌡ Servido??',
			"fr": '⌠😂⌡ Servi??',
			"it": '⌠😂⌡ Sservito??'
		}),
	async execute(client, interaction) {

		interaction.reply({ content: `${client.tls.phrase(client, interaction, "dive.esfiha.asf")} :yum: :yum: :yum:\n https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713` })
	}
}