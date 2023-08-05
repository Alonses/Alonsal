const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const dispara_anuncio = require('../automaticos/dispara_anuncio.js')

function free_games({ client, guild_channel }) {

    fetch(`${process.env.url_apisal}/games`)
        .then(response => response.json())
        .then(async objetos_anunciados => {
            dispara_anuncio({ client, objetos_anunciados, guild_channel })
        })
        .catch(err => {
            const local = "games"
            client.error({ err, local })
        })
}

module.exports.free_games = free_games