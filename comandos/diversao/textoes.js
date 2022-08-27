const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('text')
		.setDescription('⌠😂⌡ Um texto aleatório'),
	async execute(client, interaction) {

        return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })
        
        fetch('https://apisal.herokuapp.com/random?textoes')
        .then(response => response.json())
        .then(async res => {

            const channel = client.channels.cache.get(interaction.channel.id)
            
            interaction.deferReply()

            // Webhook
            channel.createWebhook({
                name: res.nome,
                avatar: res.foto,
            })
            .then(webhook => {
                webhook.send({
                    content: res.texto
                }).then(() => {
                    if (typeof res.texto_2 !== "undefined")
                        webhook.send({
                            content: res.texto_2
                        })

                    webhook.delete()
                })
            })
            
            await interaction.editReply({
                content: `⠀`,
            }).then(() => { interaction.deleteReply() })
        })
	}
}