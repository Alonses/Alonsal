const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('curiosidade')
		.setDescription('⌠😂⌡ Uma curiosidade aleatória'),
	async execute(client, interaction) {
        
        fetch('https://apisal.herokuapp.com/curiosidades')
        .then(response => response.json())
        .then(async res => {

            const embed = new EmbedBuilder()
            .setColor(0x29BB8E)
            .setAuthor({ name: res.nome, iconURL: res.foto })
            .setDescription(res.texto)

            if(res.img_curio) // Imagem da curiosidade
            embed.setImage(res.img_curio)
        
    		    return interaction.reply({embeds: [embed]})
        })
	  }
}