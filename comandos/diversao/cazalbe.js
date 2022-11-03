const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/cazalbe.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cazalbe')
		.setDescription('⌠😂⌡ Cazalbe King of Prasody')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Cazalbe rei da prassódia',
			"fr": '⌠😂⌡ Cazalbe roi de la prasodie',
			"it": '⌠😂⌡ Cazalbe re della prasodia'
		})
		.addSubcommand(subcommand =>
			subcommand
				.setName('gif')
				.setDescription('⌠😂⌡ Summons a gif of cazalbe')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ Invoca um gif do cazalbe',
					"es-ES": '⌠😂⌡ Invoca un gif de cazalbe',
					"fr": '⌠😂⌡ Invoque un gif de cazalbe',
					"it": '⌠😂⌡ Evoca una gif di cazalbe'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('laugh')
				.setNameLocalizations({
					"pt-BR": 'risada',
					"es-ES": 'risa',
					"fr": 'rire',
					"it": 'risata'
				})
				.setDescription('⌠😂⌡ The cazalbe laugh')
				.setDescriptionLocalizations({
					"pt-BR": '⌠😂⌡ A risada do cazalbe',
					"es-ES": '⌠😂⌡ La risa del cazalbe',
					"fr": '⌠😂⌡ Le rire cazalbe',
					"it": '⌠😂⌡ La risata di Cazalbe'
				}))
		.addSubcommand(subcommand =>
			subcommand
				.setName('piada')
				.setDescription('⌠😂|🇧🇷⌡ Conta uma piada')),
	async execute(client, interaction) {

		if (interaction.options.getSubcommand() === "gif")
			return interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
		else if (interaction.options.getSubcommand() === "laugh") {
			const file = new AttachmentBuilder('./arquivos/songs/cazalbe.mp3')
			return interaction.reply({ files: [file] })
		} else {

			const user = client.usuarios.getUser(interaction.user.id)
			await interaction.deferReply()

			fetch("https://api-charadas.herokuapp.com/puzzle?lang=ptbr")
				.then(response => response.json())
				.then(async res => {

					const embed = new EmbedBuilder()
						.setTitle('Cazalbé')
						.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Carlos_Alberto_in_2019.jpg/1200px-Carlos_Alberto_in_2019.jpg')
						.setColor(user.misc.embed)
						.setDescription(`${res.question}\n${res.answer}`)

					interaction.editReply({ embeds: [embed] })
				})
		}
	}
}