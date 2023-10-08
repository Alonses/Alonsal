const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("peace")
		.setNameLocalizations({
			"de": 'frieden',
			"es-ES": 'paz',
			"fr": 'paix',
			"it": 'pace',
			"pt-BR": 'paz',
			"ru": 'мир'
		})
		.setDescription("⌠😂⌡ Make love not war")
		.setDescriptionLocalizations({
			"de": '⌠😂⌡ Liebe machen, nicht Krieg',
			"es-ES": '⌠😂⌡ Haz el amor y no la guerra',
			"fr": '⌠😂⌡ Faites l\'amour pas la guerre',
			"it": '⌠😂⌡ Fai l\'amore non la guerra',
			"pt-BR": '⌠😂⌡ Faça amor não faça guerra',
			"ru": '⌠😂⌡ Занимайтесь любовью, а не войной'
		}),
	async execute({ client, user, interaction }) {
		interaction.reply({
			content: 'https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263',
			ephemeral: client.decider(user?.conf.ghost_mode, 0)
		})
	}
}