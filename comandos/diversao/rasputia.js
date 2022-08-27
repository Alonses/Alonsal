const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')
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

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		else {
			
			return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })
			
			interaction.deferReply()

			const channel = client.channels.cache.get(interaction.channel.id)
			
			// Webhook
			fetch('https://apisal.herokuapp.com/random?rasputia')
			.then(response => response.json())
			.then(async res => {
				
				// Webhook
				channel.createWebhook({
					name: res.nome,
					avatar: res.foto,
				})
				.then(webhook => {
					webhook.send({ content: res.texto })
					.then(() => { webhook.delete() })
				})
				
				await interaction.editReply({
					content: `⠀`,
				}).then(() => { interaction.deleteReply() })
			})
		}
	}
}