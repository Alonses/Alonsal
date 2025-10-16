const { SlashCommandBuilder } = require('discord.js')

const { gifs } = require("../../files/json/gifs/avocado.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nikocado")
		.setDescription("⌠😂⌡ It's your fault"),
	async execute({ client, user, interaction, user_command }) {

		interaction.reply({
			content: gifs[client.execute("random", { intervalo: gifs })],
			flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
		})
	}
}