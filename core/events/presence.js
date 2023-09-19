const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { ActivityType } = require('discord.js')

const { activities } = require('../../files/json/text/activities.json')
const formata_texto = require('../formatters/formata_texto')

let selected = [], timeout_presence, status_atual

const actionTypes = [ActivityType.Playing, ActivityType.Watching, ActivityType.Listening]

module.exports = async ({ client }) => {

    // Impede que o bot atualize o status
    if (client.x.force_update) return

    if (client.x.status) {
        client.user().setActivity("Vapor p/ fora!", { type: ActivityType.Playing })

        setTimeout(() => {
            requisita_status(client)
        }, 10000)
    } else
        client.user().setActivity("Baidu explosivo", { type: ActivityType.Playing })
}

function requisita_status(client) {

    let num

    if (selected.length === activities.length)
        selected = []

    do { // Repetirá enquanto o número já tiver sido escolhido
        num = client.random(activities)
    } while (selected.includes(num))

    let tempo_minimo = 0

    // Tempo mínimo para atividade "ouvindo"
    if (activities[num].type === 2)
        tempo_minimo = client.random(50000, 60000)

    // Tempo mínimo para atividade "assistindo"
    if (activities[num].type === 1)
        tempo_minimo = client.random(50000, 80000)

    // Exibirá o status escolhido após um tempo aleatório
    timeout_presence = setTimeout(async () => {

        let texto_status = activities[num].text

        if (texto_status.includes("server_repl"))
            texto_status = texto_status.replace("server_repl", client.guilds().size)

        if (texto_status.includes("canais_repl"))
            texto_status = texto_status.replace("canais_repl", client.channels(0).size)

        if (texto_status.includes("activities_repl"))
            texto_status = texto_status.replace("activities_repl", activities.length)

        if (texto_status.includes("version_repl")) {
            const bot = await client.getBot()
            texto_status = texto_status.replace("version_repl", bot.persis.version)
        }

        if (texto_status.includes("commands_repl")) {
            const bot = await client.getBot()
            texto_status = texto_status.replace("commands_repl", bot.persis.commands)
        }

        // Exibindo o status personalizado de forma aleatória por um tempo
        client.user().setActivity(texto_status, { type: actionTypes[activities[num].type] })
        client.cached.presence = num // Registrando o número do status atual

        requisita_status(client)
    }, 15000 + client.random(5000, tempo_minimo))
}

function acompanha_scrobble(client, user) {

    clearTimeout(timeout_presence)

    fetch(`https://www.last.fm/pt/user/${user}`)
        .then(response => response.text())
        .then(async res => {

            if (res.includes("modal?action=scrobbling-now-theirs\"")) {

                let scrobble_atual = `${formata_texto(res.split("modal?action=scrobbling-now-theirs\"")[0].split("data-toggle-button-current-state=")[2].split("title=\"")[1].split("\"")[0])} - ${formata_texto(res.split("modal?action=scrobbling-now-theirs\"")[0].split("data-toggle-button-current-state=")[2].split("title=\"")[2].split("\"")[0])}`

                if (scrobble_atual !== status_atual) {
                    // Exibindo o status personalizado sincronizado com o LastFM
                    client.user().setActivity(scrobble_atual, { type: actionTypes[2] })

                    status_atual = scrobble_atual
                }

                // Acionando a função novamente
                setTimeout(() => {
                    acompanha_scrobble(client, user)
                }, 15000)
            } else {
                requisita_status(client)
                client.notify(process.env.channel_feeds, `:radio: | O Acompanhamento de Scrobbles foi desligado por inatividade.`)
            }
        })
}

module.exports.requisita_status = requisita_status
module.exports.acompanha_scrobble = acompanha_scrobble