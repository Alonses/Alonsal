const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const dispara_anuncio = require('../../auto/send_announcement')

module.exports = async ({ client, user, interaction }) => {

    client.notify(process.env.channel_feeds, `:video_game: :sparkles: | Disparando manualmente os anúncios de jogos gratuitos.`)

    fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
        .then(response => response.json())
        .then(async objetos_anunciados => {
            dispara_anuncio({ client, objetos_anunciados })

            interaction.reply({
                content: ":video_game: | Anúncio de jogos gratuitos enviado para os canais clientes!",
                ephemeral: true
            })
        })
        .catch(err => {
            client.error(err, "Games")
        })
}