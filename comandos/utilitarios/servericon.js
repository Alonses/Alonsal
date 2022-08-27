const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servericon')
		.setDescription('⌠💡⌡ Veja o icone do servidor.'),
	async execute(client, interaction) {
        
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        let icone_server = interaction.guild.iconURL({ size: 2048 })
        icone_server = icone_server.replace(".webp", ".gif")
        const download_icon = utilitarios[4]["download_icon"].replace("link_repl", icone_server)

        fetch(icone_server)
        .then(res => {
            if (res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const embed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription(download_icon)
            .setColor(0x29BB8E)
            .setImage(icone_server)

            interaction.reply({ embeds: [embed] })
        })
    }
}