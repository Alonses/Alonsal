const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/briga.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("galerito")
		.setDescription("⌠😂⌡ Random gifs of rogéria")
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Gifs aleatórios da rogéria',
			"es-ES": '⌠😂⌡ Gifs aleatorios de rogéria',
			"fr": '⌠😂⌡ Gifs aléatoires de rogéria',
			"it": '⌠😂⌡ Gif casuali di rogéria',
			"ru": '⌠😂⌡ Случайные гифки rogéria'
		}),
	async execute(client, user, interaction) {
		const num = Math.round((gifs.length - 1) * Math.random())
		interaction.reply({ content: gifs[num], ephemeral: user.misc.ghost_mode })
	}
}