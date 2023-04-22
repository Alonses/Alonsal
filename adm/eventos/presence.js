const { ActivityType } = require('discord.js')

const { activities } = require('../../arquivos/json/text/activities.json')

let selected = []

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
        tempo_minimo = client.random(50000, 45000)

    // Tempo mínimo para atividade "assistindo"
    if (activities[num].type === 1)
        tempo_minimo = client.random(50000, 70000)

    // Exibirá o status escolhido após um tempo aleatório
    setTimeout(() => {

        let texto_status = activities[num].text

        if (texto_status.includes("server_repl"))
            texto_status = texto_status.replace("server_repl", client.guilds().size)

        if (texto_status.includes("canais_repl"))
            texto_status = texto_status.replace("canais_repl", client.channels(0).size)

        // Exibindo o status personalizado de forma aleatória por um tempo
        client.user().setActivity(texto_status, { type: actionTypes[activities[num].type] })

        requisita_status(client)
    }, 15000 + client.random(5000, tempo_minimo))
}