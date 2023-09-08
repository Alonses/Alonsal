const { SlashCommandBuilder } = require('discord.js')

const { gifs } = require("../../files/json/gifs/avocado.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nikocado")
		.setDescription("⌠😂⌡ It's your fault"),
	async execute(client, user, interaction) {
		interaction.reply({
			content: gifs[client.random(gifs)],
			ephemeral: client.decider(user?.conf.ghost_mode, 0)
		})
	}
}