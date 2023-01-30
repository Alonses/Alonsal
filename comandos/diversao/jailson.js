const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { gifs } = require("../../arquivos/json/gifs/jailson.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jailson')
		.setDescription('⌠😂⌡ As soon as I can\'t resist, vaiinn')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Assim que não resisto, vaiinn',
			"es-ES": '⌠😂⌡ Así que no me resistiré, vaiinn',
			"fr": '⌠😂⌡ Dès que je ne peux pas résister, vaiinn',
			"it": '⌠😂⌡ Non resisterò, vaiinn',
			"ru": '⌠😂⌡ Как только не выдержу, иду'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a gif of jaja')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do jaja',
					"es-ES": '⌠😂⌡ Invoca un gif de jaja',
					"fr": '⌠😂⌡ Invoque un gif de jaja',
					"it": '⌠😂⌡ Evoca una gif di Jaja',
					"ru": '⌠😂⌡ Отправить jaja gif'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂|🇧🇷⌡ Invoca uma frase do jaja')),
	async execute(client, user, interaction) {

		if (!interaction.channel.nsfw)
			return interaction.reply({ content: `:tropical_drink: | ${client.tls.phrase(user, "dive.jaja.nsfw_jaja")}`, ephemeral: true })

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply({ content: gifs[Math.round((gifs.length - 1) * Math.random())], ephemeral: user.misc.ghost_mode })
		} else {

			fetch(`${process.env.url_apisal}/random?jailson`)
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(client.embed_color(user.misc.color))
						.setDescription(`- "${res.texto}"`)

					interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
				})
		}
	}
}