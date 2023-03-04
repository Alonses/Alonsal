const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const create_menus = require('../../adm/discord/create_menus.js')

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')

const { gifs } = require("../../arquivos/json/gifs/rasputia.json")
const { relation } = require('../../arquivos/songs/norbit/songs.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rasputia")
		.setDescription("⌠😂⌡ Rasputia in its glory")
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
				.setDescription("⌠😂|🇧🇷⌡ Invoca uma fala do filme Norbit"))
		.addSubcommand(subcommand =>
			subcommand
				.setName("menu")
				.setDescription("⌠😂|🇧🇷⌡ Escolher uma frase do filme Norbit")),
	async execute(client, user, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply({ content: gifs[client.random(gifs)], ephemeral: user?.conf.ghost_mode || false })
		} else if (interaction.options.getSubcommand() === "frase") {

			fetch(`${process.env.url_apisal}/random?rasputia`)
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(client.embed_color(user.misc.color))
						.setDescription(`- "${res.texto}"`)

					interaction.reply({ embeds: [embed], ephemeral: user?.conf.ghost_mode || false })
				})
		} else if (interaction.options.getSubcommand() === "fala") {

			let num = client.random(client.countFiles("./arquivos/songs/norbit", "ogg") - 1)

			const file = new AttachmentBuilder(`./arquivos/songs/norbit/norbit_${num}.ogg`, { name: 'norbit.ogg' })

			return interaction.reply({ files: [file], ephemeral: user?.conf.ghost_mode || false })
		} else
			return interaction.reply({ content: 'Escolha uma das frases abaixo!', components: [create_menus("norbit", client, interaction, user, relation)], ephemeral: user?.conf.ghost_mode || false })
	}
}