const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/cazalbe.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cazalbe')
		.setDescription('⌠😂⌡ Cazalbe King of Prasody')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Cazalbe rei da prassódia',
			"fr": '⌠😂⌡ Cazalbe roi de la prasodie'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a gif of cazalbe')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do cazalbe',
					"fr": '⌠😂⌡ Invoque un gif de cazalbe'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('piada')
				.setDescription('⌠😂|🇧🇷⌡ Invoca uma piada excelentississima')),
	async execute(client, interaction) {

		if (interaction.options.getSubcommand() === "gif") {
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		} else {

			const user = client.usuarios.getUser(interaction.user.id)
			await interaction.deferReply()

			fetch("https://api-charadas.herokuapp.com/puzzle?lang=ptbr")
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle('Cazalbé')
						.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Carlos_Alberto_in_2019.jpg/1200px-Carlos_Alberto_in_2019.jpg')
						.setColor(user.color)
						.setDescription(`${res.question}\n${res.answer}`)

					interaction.editReply({ embeds: [embed] })
				})
		}
	}
}