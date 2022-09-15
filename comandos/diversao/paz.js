const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('peace')
		.setNameLocalizations({
			"pt-BR": 'paz',
			"fr": 'paix'
		})
		.setDescription('⌠😂⌡ Make love not war')
		.setDescriptionLocalizations({
			"pt-BR": '⌠😂⌡ Faça amor não faça guerra',
			"es-ES": '⌠😂⌡ Haz el amor y no la guerra',
			"fr": '⌠😂⌡ Faites l\'amour pas la guerre'
		}),
	async execute(client, interaction) {
		interaction.reply('https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263')
	}
}