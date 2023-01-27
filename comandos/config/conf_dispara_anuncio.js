const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const dispara_anuncio = require('../../adm/automaticos/dispara_anuncio')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_dispara_anuncio')
        .setDescription('⌠🤖⌡ Dispara o anúncio de games manualmente')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        interaction.reply({ content: "Enviando os anúncios para os canais clientes.", ephemeral: true })

        client.notify(process.env.feeds_channel, 0, `:video_game: :sparkles: | Disparando manualmente anúncios de jogos gratuitos`);

        fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
            .then(response => response.json())
            .then(async objetos_anunciados => {
                dispara_anuncio({ client, objetos_anunciados })
            })
            .catch(err => {
                const local = "games"
                require('../eventos/error.js')({ client, err, local })
            })
    }
}