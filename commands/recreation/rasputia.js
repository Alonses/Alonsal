const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require("../../files/json/gifs/rasputia.json")
const { relation } = require('../../files/songs/norbit/songs.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rasputia")
		.setDescription("⌠😂⌡ Rasputia in its glory")
		.addSubcommand(subcommand =>
			subcommand
				.setName("gif")
				.setDescription("⌠😂⌡ Summons a rasputia gif")
				.setDescriptionLocalizations({
					"de": '⌠😂⌡ Beschwört ein Rasputia-GIF',
					"es-ES": '⌠😂⌡ Invoca un gif de rasputia',
					"fr": '⌠😂⌡ Invoque un rasputia gif',
					"it": '⌠😂⌡ Evoca una gif di rasputia',
					"pt-BR": '⌠😂⌡ Invoca um gif da rasputia',
					"ru": '⌠😂⌡ Отправить гифку с rasputia'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName("frase")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma frase do filme Norbit"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("fala")
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma fala do filme Norbit"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("menu")
				.setDescription("⌠😂|🇧🇷⌡ Escolha uma frase do filme Norbit")),
	async execute({ client, user, interaction }) {

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply({
				content: gifs[client.random(gifs)],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		else if (interaction.options.getSubcommand() === "frase") {

			fetch(`${process.env.url_apisal}/random?rasputia`)
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
		} else if (interaction.options.getSubcommand() === "fala") {

			let num = client.random(client.countFiles("./files/songs/norbit", "ogg") - 1)

			const file = new AttachmentBuilder(`./files/songs/norbit/norbit_${num}.ogg`, { name: "norbit.ogg" })

			interaction.reply({
				files: [file],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		} else {

			const data = {
				alvo: "norbit",
				values: relation
			}

			interaction.reply({
				content: client.tls.phrase(user, "menu.menus.escolher_frase", 6),
				components: [client.create_menus({ client, interaction, user, data })],
				ephemeral: client.decider(user?.conf.ghost_mode, 0)
			})
		}
	}
}