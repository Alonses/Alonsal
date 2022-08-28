const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('esfiha')
		.setDescription('⌠😂⌡ Servidos??'),
	async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        interaction.reply({ content: `${diversao[1]["asf"]} :yum: :yum: :yum:\n https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713` })
    }   
}