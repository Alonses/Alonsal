const { SlashCommandBuilder } = require('discord.js')
const { gifs } = require("../../arquivos/json/gifs/avocado.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nikocado')
		.setDescription('⌠😂⌡ It\'s your fault'),
	async execute(client, interaction) {
		interaction.reply(gifs[Math.round((gifs.length - 1) * Math.random())])
	},
}