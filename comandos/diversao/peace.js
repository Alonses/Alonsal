const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("peace")
		.setNameLocalizations({
			"pt-BR": 'paz',
			"es-ES": 'paz',
			"fr": 'paix',
			"it": 'pace',
			"ru": 'мир'
		})
		.setDescription("⌠😂⌡ Make love not war")
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Faça amor não faça guerra',
			"es-ES": '⌠😂⌡ Haz el amor y no la guerra',
			"fr": '⌠😂⌡ Faites l\'amour pas la guerre',
			"it": '⌠😂⌡ Fai l\'amore non la guerra',
			"ru": '⌠😂⌡ Занимайтесь любовью, а не войной'
		}),
	async execute(client, user, interaction) {
		interaction.reply({
			content: 'https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263',
			ephemeral: client.decider(user?.conf.ghost_mode, 0)
		})
	}
}