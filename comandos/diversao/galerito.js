const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/briga.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('galerito')
		.setDescription('⌠😂⌡ Random gifs of rogéria')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Gifs aleatórios da rogéria',
			"fr": '⌠😂⌡ Gifs aléatoires de rogéria'
		}),
	async execute(client, interaction) {
        const num = Math.round((gifs.length - 1) * Math.random())
		interaction.reply(gifs[num])
	}
}