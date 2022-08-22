const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/cazalbe.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cazalbe')
		.setDescription('⌠😂⌡ Cazalbe rei da prassódia')
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Invoca um gif do cazalbe'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('piada')
				.setDescription('⌠😂⌡ Invoca uma piada excelentississima')),
	async execute(client, interaction) {

		if(interaction.options.getSubcommand() === "gif")
			interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		else{
			
			interaction.deferReply()

			fetch("https://api-charadas.herokuapp.com/puzzle?lang=ptbr")
			.then(response => response.json())
        	.then(async res => {
				
				const channel = client.channels.cache.get(interaction.channel.id)

				// Webhook
				channel.createWebhook({
					name: 'Cazalbé',
					avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Carlos_Alberto_in_2019.jpg/1200px-Carlos_Alberto_in_2019.jpg',
				})
				.then(webhook => {
					webhook.send({ content: `${res.question}\n${res.answer}` })
					.then(() => { webhook.delete() })
				})

				await interaction.editReply({
					content: `⠀`,
				}).then(() => { interaction.deleteReply() })
			})
		}
	}
}