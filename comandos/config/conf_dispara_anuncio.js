const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const dispara_anuncio = require('../../adm/automaticos/dispara_anuncio')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_dispara_anuncio")
        .setDescription("⌠🤖⌡ Dispara o anúncio de games manualmente")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        interaction.reply({ content: ":video_game: | Enviando os anúncios para os canais clientes.", ephemeral: true })

        client.notify(process.env.channel_feeds, `:video_game: :sparkles: | Disparando manualmente os anúncios de jogos gratuitos.`)

        fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
            .then(response => response.json())
            .then(async objetos_anunciados => {
                dispara_anuncio({ client, objetos_anunciados })
            })
            .catch(err => {
                const local = "games"
                client.error({ err, local })
            })
    }
}