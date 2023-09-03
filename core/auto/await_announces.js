const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const dispara_anuncio = require('./send_announcement')

module.exports = async ({ client }) => {

    if (client.id() !== process.env.client_1 && !client.x.status) return

    const date1 = new Date() // Ficará esperando até quinta feira ao meio dia para executar a rotina
    let controle = 0

    // Previne que o bot dispare anúncios indesejados se for atualizado após o meio dia das quintas
    if (date1.getDay() === 4 && date1.getHours() > 13)
        controle = 7

    const dias = [4, 3, 2, 1, controle, 6, 5]
    const tempo_restante = (dias[date1.getDay()] * 86400000) + ((12 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000)

    // Atualiza todo dia
    // const tempo_restante = ((12 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000)

    setTimeout(() => {
        gera_anuncio(client, 604800000)
        requisita_anuncio(client, 604800000)
    }, tempo_restante) // Executa de 1 em 1 semana
}

function requisita_anuncio(client, aguardar_tempo) {
    setTimeout(() => {
        gera_anuncio(client, aguardar_tempo)
        requisita_anuncio(client, aguardar_tempo)
    }, aguardar_tempo)
}

async function gera_anuncio(client, proxima_att) {

    if (process.env.client_1 === client.id())
        client.notify(process.env.channel_feeds, `:video_game: :sparkles: | Disparando automaticamente os anúncios de jogos gratuitos`)

    fetch(`${process.env.url_apisal}/games?reload=1`) // Forçando o update da API
        .then(response => response.json())
        .then(async objetos_anunciados => {
            dispara_anuncio({ client, objetos_anunciados })
        })
        .catch(err => {
            const local = "games"
            client.error({ err, local })
        })

    next_att(client, proxima_att)
}

function next_att(client, tempo_restante) {

    tempo_restante = Math.floor(client.timestamp() + (tempo_restante / 1000))

    client.notify(process.env.channel_feeds, `:video_game: :sparkles: | Próxima atualização de jogos gratuitos em\n[ <t:${tempo_restante}:F> ]`)
}