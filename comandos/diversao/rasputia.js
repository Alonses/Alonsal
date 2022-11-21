const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/rasputia.json")
const { getUser } = require("../../adm/database/schemas/User.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rasputia')
		.setDescription('⌠😂⌡ Rasputia in its glory')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Rasputia em sua glória',
			"es-ES": '⌠😂⌡ Rasputia en todo su esplendor',
			"fr": '⌠😂⌡ Rasputia dans sa splendeur',
			"it": '⌠😂⌡ Rasputia nel suo splendore'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a rasputia gif')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif da rasputia',
					"es-ES": '⌠😂⌡ Invoca un gif de rasputia',
					"fr": '⌠😂⌡ Invoque un rasputia gif',
					"it": '⌠😂⌡ Evoca una gif di rasputia'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂|🇧🇷⌡ Invoca uma frase da rasputia')),
	async execute(client, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {

			await interaction.deferReply()
			const user = await getUser(interaction.user.id)

			fetch('https://apisal.herokuapp.com/random?rasputia')
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(client.embed_color(user.misc.color))
						.setDescription(`- "${res.texto}"`)

					interaction.editReply({ embeds: [embed] })
				})
		}
	}
}