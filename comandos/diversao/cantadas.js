const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cantada')
        .setDescription('⌠😂|🇧🇷⌡ Uma cantada aleatória do Vai dar namoro™️'),
    async execute(client, user, interaction) {

        await interaction.deferReply()

        fetch(`${process.env.url_apisal}/random?cantadas`)
            .then(response => response.json())
            .then(async res => {

                const embed = new EmbedBuilder()
                    .setTitle(res.nome)
                    .setThumbnail(res.foto)
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`> "${res.texto}"`)

                interaction.editReply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
            })
    }
}