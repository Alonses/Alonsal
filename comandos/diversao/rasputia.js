const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/rasputia.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rasputia')
		.setDescription('⌠😂⌡ Rasputia em sua glória')
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Invoca um gif da rasputia'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂⌡ Invoca uma frase da rasputia')),
	async execute(client, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {
				
			await interaction.deferReply()

			fetch('https://apisal.herokuapp.com/random?rasputia')
			.then(response => response.json())
			.then(async res => {
				
				const embed = new EmbedBuilder()
				.setTitle(res.nome)
				.setThumbnail(res.foto)
				.setColor(0x29BB8E)
				.setDescription(`- "${res.texto}"`)
				
				interaction.editReply({ embeds: [embed] })
			})
		}
	}
}