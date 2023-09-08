const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { gifs } = require("../../files/json/gifs/jailson.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("jailson")
		.setDescription("⌠😂⌡ As soon as I can\'t resist, vaiinn")
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Summons a gif of jaja")
				.setDescriptionLocalizations({
					"de": '⌠😂⌡ Beschwört ein Jaja-GIF',
					"es-ES": '⌠😂⌡ Invoca un gif de jaja',
					"fr": '⌠😂⌡ Invoque un gif de jaja',
					"it": '⌠😂⌡ Evoca una gif di Jaja',
					"pt-BR": '⌠😂⌡ Invoca um gif do jaja',
					"ru": '⌠😂⌡ Отправить jaja gif'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("frase")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma frase do jaja")),
	async execute(client, user, interaction) {

		if (!interaction.channel.nsfw)
			return client.tls.reply(interaction, user, "dive.jaja.nsfw_jaja", true, 33)

		if (interaction.options.getSubcommand() === "gif") {
			interaction.reply({
				content: gifs[client.random(gifs)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		} else {

			fetch(`${process.env.url_apisal}/random?jailson`)
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setColor(client.embed_color(user.misc.color))
						.setThumbnail(res.foto)
						.setDescription(`- "${res.texto}"`)

					interaction.reply({
						embeds: [embed],
						ephemeral: client.decider(user?.conf.ghost_mode, 0)
					})
				})
		}
	}
}