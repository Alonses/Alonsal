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
			"it": '⌠😂⌡ Non resisterò, vaiinn'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a gif of jaja')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do jaja',
					"es-ES": '⌠😂⌡ Invoca un gif de jaja',
					"fr": '⌠😂⌡ Invoque un gif de jaja',
					"it": '⌠😂⌡ Evoca una gif di Jaja'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂|🇧🇷⌡ Invoca uma frase do jaja')),
	async execute(client, interaction) {

		if (!interaction.channel.nsfw) return interaction.reply({ content: `:tropical_drink: | ${client.tls.phrase(client, interaction, "dive.jaja.nsfw_jaja")}`, ephemeral: true })

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {

			await interaction.deferReply()
			const user = await client.getUser(interaction.user.id)

			fetch(`${process.env.url_apisal}/random?jailson`)
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