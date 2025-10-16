const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { createGame, verifyInvalidGames, verifyGame } = require('../../database/schemas/Game')

const dispara_anuncio = require('../../auto/send_announcement')

module.exports = async ({ client, interaction }) => {

    client.execute("notify", {
        id_canal: process.env.channel_feeds,
        conteudo: { content: ":video_game: :sparkles: | Disparando manualmente os anúncios de jogos gratuitos." }
    })

    fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
        .then(response => response.json())
        .then(async objetos_anunciados => {

            // Status desconhecido ou sem link de anúncio
            if (objetos_anunciados.status === "501" || objetos_anunciados.status === "404")
                return client.execute("notify", {
                    id_canal: process.env.channel_feeds,
                    conteudo: { content: ":stop_sign: | Houve um problema com o anúncio automático, verifique a APISAL." }
                })

            if (objetos_anunciados.length === 0)
                return client.execute("notify", {
                    id_canal: process.env.channel_feeds,
                    conteudo: { content: ":stop_sign: | Não há jogos gratuitos disponíveis na Epic Games atualmente." }
                })

            if (await verifyGame(objetos_anunciados[0])) // Verificando se há jogos repetidos informados
                return client.execute("notify", {
                    id_canal: process.env.channel_feeds,
                    conteudo: { content: ":stop_sign: | Envio de anúncio de jogos cancelado, há jogos repetidos sendo enviados." }
                })

            // Registrando os games no banco
            objetos_anunciados.forEach(async game => {
                game.expira = client.execute("timestamp", { entrada: game.expira, hora_entrada: game.hora_expira })
                await createGame(game)
            })

            // Verificando pelos games que já expiraram
            await verifyInvalidGames()
            dispara_anuncio({ client, objetos_anunciados })

            interaction.reply({
                content: ":video_game: | Anúncio de jogos gratuitos enviado para os canais clientes!",
                flags: "Ephemeral"
            })
        })
        .catch(err => {
            client.error(err, "Games")
        })
}