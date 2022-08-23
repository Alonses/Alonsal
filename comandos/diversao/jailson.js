const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/jailson.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jailson')
		.setDescription('⌠😂⌡ Assim que não resisto, vaiinn')
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Invoca um gif do jaja'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('frase')
				.setDescription('⌠😂⌡ Invoca uma frase do jaja')),
	async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        if(!interaction.channel.nsfw) return interaction.reply({ content: `:tropical_drink: | ${diversao[6]["nsfw_jaja"]}`, ephemeral: true})

		if(interaction.options.getSubcommand() === "gif")
			interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		else{
			
			return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })
			
			const channel = client.channels.cache.get(interaction.channel.id)

			interaction.deferReply()
			
			fetch('https://apisal.herokuapp.com/random?jailson')
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