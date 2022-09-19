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
			"fr": '⌠😂⌡ Dès que je ne peux pas résister, vaiinn'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a gif of jaja')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do jaja',
					"fr": '⌠😂⌡ Invoque un gif de jaja'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂|🇧🇷⌡ Invoca uma frase do jaja')),
	async execute(client, interaction) {

		const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
		const user = client.usuarios.getUser(interaction.user.id)

		if (!interaction.channel.nsfw) return interaction.reply({ content: `:tropical_drink: | ${diversao[6]["nsfw_jaja"]}`, ephemeral: true })

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {

			await interaction.deferReply()

			fetch('https://apisal.herokuapp.com/random?jailson')
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle(res.nome)
						.setThumbnail(res.foto)
						.setColor(user.color)
						.setDescription(`- "${res.texto}"`)

					interaction.editReply({ embeds: [embed] })
				})
		}
	}
}