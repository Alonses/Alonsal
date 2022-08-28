const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('paz')
		.setDescription('⌠😂⌡ Faça amor não faça ódio'),
	async execute(client, interaction) {
        interaction.reply('https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263')
    }
}