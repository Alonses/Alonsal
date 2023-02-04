const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { readdirSync } = require('fs')

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require("../../arquivos/json/gifs/rasputia.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rasputia")
		.setDescription("⌠😂⌡ Rasputia in its glory")
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Rasputia em sua glória',
			"es-ES": '⌠😂⌡ Rasputia en todo su esplendor',
			"fr": '⌠😂⌡ Rasputia dans sa splendeur',
			"it": '⌠😂⌡ Rasputia nel suo splendore',
			"ru": '⌠😂⌡ Rasputia во всей красе'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Invoca um gif da rasputia")
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif da rasputia',
					"es-ES": '⌠😂⌡ Invoca un gif de rasputia',
					"fr": '⌠😂⌡ Invoque un rasputia gif',
					"it": '⌠😂⌡ Evoca una gif di rasputia',
					"ru": '⌠😂⌡ Отправить гифку с rasputia'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("frase")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma frase do filme Norbit"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("fala")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma fala do filme Norbit")),
	async execute(client, user, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply({ content: gifs[Math.round((gifs.length - 1) * Math.random())], ephemeral: user.misc.ghost_mode })
		} else if (interaction.options.getSubcommand() === "frase") {

			fetch(`${process.env.url_apisal}/random?rasputia`)
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(client.embed_color(user.misc.color))
						.setDescription(`- "${res.texto}"`)

					interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
				})
		} else {
			let i = 0

			for (const file of readdirSync(`./arquivos/songs/norbit`).filter(file => file.endsWith('.ogg')))
				i++

			let num = Math.round((i - 1) * Math.random())

			const file = new AttachmentBuilder(`./arquivos/songs/norbit/norbit_${num}.ogg`, { name: 'norbit.ogg' })

			return interaction.reply({ files: [file], ephemeral: user.misc.ghost_mode })
		}
	}
}