const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/rasputia.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rasputia')
		.setDescription('⌠😂⌡ Rasputia in its glory')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Rasputia em sua glória',
			"es-ES": '⌠😂⌡ Rasputia en todo su esplendor',
			"fr": '⌠😂⌡ Rasputia dans sa splendeur'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a rasputia gif')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif da rasputia',
					"fr": '⌠😂⌡ Invoque un rasputia gif'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('phrase')
				.setNameLocalizations({
					"pt-BR": 'frase',
					"fr": 'phrase'
				})
				.setDescription('⌠😂⌡ Summons a phrase from rasputia')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca uma frase da rasputia',
					"fr": '⌠😂⌡ Invoque une phrase de rasputia'
				})),
	async execute(client, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {

			await interaction.deferReply()
			const user = client.usuarios.getUser(interaction.user.id)

			fetch('https://apisal.herokuapp.com/random?rasputia')
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(user.misc.embed)
						.setDescription(`- "${res.texto}"`)

					interaction.editReply({ embeds: [embed] })
				})
		}
	}
}