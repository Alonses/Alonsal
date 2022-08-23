const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cantada')
        .setDescription('⌠😂⌡ Uma cantada aleatória do Vai dar namoro™️'),
    async execute(client,  interaction) {
		
		return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })
		
		interaction.deferReply()

        fetch('https://apisal.herokuapp.com/random?cantadas')
        .then(response => response.json())
        .then(async res => {
            
			const channel = client.channels.cache.get(interaction.channel.id)
			
            // Webhook
			channel.createWebhook({
				name: res.nome,
				avatar: res.foto,
			})
			.then(webhook => {
				webhook.send({ content: res.texto })
				.then(() => { webhook.delete() })
			})
			
			await interaction.editReply({
				content: `⠀`,
			}).then(() => { interaction.deleteReply() })
        })
    }
}