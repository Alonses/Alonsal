const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { createGame, verifyGame } = require('../database/schemas/Game')

const dispara_anuncio = require('./send_announcement')

gera_anuncio = async (client, proxima_att) => {

    // Apenas o bot principal realiza os anúncios automáticos
    if (client.id() !== process.env.client_1) return

    if (process.env.client_1 === client.id())
        client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: ":video_game: :sparkles: | Disparando automaticamente os anúncios de jogos gratuitos" } })

    fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
        .then(response => response.json())
        .then(async objetos_anunciados => {

            // Status desconhecido ou sem link de anúncio
            if (objetos_anunciados.status === "501" || objetos_anunciados.status === "404")
                return client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: ":stop_sign: | Houve um problema com o anúncio automático, verifique a APISAL." } })

            if (objetos_anunciados.length === 0)
                return client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: ":stop_sign: | Não há jogos gratuitos disponíveis na Epic Games atualmente." } })

            if (await verifyGame(objetos_anunciados[0])) // Verificando se há jogos repetidos informados
                return client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: ":stop_sign: | Envio de anúncio de jogos cancelado, há jogos repetidos sendo enviados." } })

            // Registrando os games no banco
            objetos_anunciados.forEach(async game => {
                game.expira = client.execute("timestamp", { entrada: game.expira, hora_entrada: game.hora_expira })

                await createGame(game)
            })

            dispara_anuncio({ client, objetos_anunciados })
        })
        .catch(err => {
            client.error(err, "Games")
        })

    next_att(client, proxima_att)
}

next_att = (client, tempo_restante) => {
    tempo_restante = Math.floor(client.execute("timestamp") + (tempo_restante / 1000))

    client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: `:video_game: :sparkles: | Próxima atualização de jogos gratuitos em\n( <t:${tempo_restante}:F> )` } })
}

module.exports.gera_anuncio = gera_anuncio