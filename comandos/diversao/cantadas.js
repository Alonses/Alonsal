const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cantada')
        .setDescription('⌠😂|🇧🇷⌡ Uma cantada aleatória do Vai dar namoro™️'),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)
        await interaction.deferReply()

        fetch('https://apisal.herokuapp.com/random?cantadas')
            .then(response => response.json())
            .then(async res => {

                const embed = new EmbedBuilder()
                    .setTitle(res.nome)
                    .setThumbnail(res.foto)
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`> "${res.texto}"`)

                interaction.editReply({ embeds: [embed] })
            })
    }
}