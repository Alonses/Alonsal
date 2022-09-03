const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
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
        
        if (!interaction.channel.nsfw) return interaction.reply({ content: `:tropical_drink: | ${diversao[6]["nsfw_jaja"]}`, ephemeral: true})

		if (interaction.options.getSubcommand() === "gif")
			interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		else {

			interaction.deferReply()
			
			fetch('https://apisal.herokuapp.com/random?jailson')
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