const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/briga.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('galerito')
		.setDescription('⌠😂⌡ Gifs aleatórios da rogéria'),
	async execute(client, interaction) {
        const num = Math.round((gifs.length - 1) * Math.random())
		interaction.reply(gifs[num])
	},
}