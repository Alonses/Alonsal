const { ActivityType } = require('discord.js')

const { activities } = require('../../arquivos/json/text/activities.json')

let selected = []

const actionTypes = [ActivityType.Playing, ActivityType.Watching, ActivityType.Listening]

module.exports = async ({ client }) => {

    if (client.id() === process.env.client_1) {

        client.user().setActivity('Vapor p/ fora!', { type: ActivityType.Playing })

        setTimeout(() => {
            requisita_status(client)
        }, 10000)

    } else
        client.user().setActivity('Baidu explosivo', { type: ActivityType.Playing })
}

function requisita_status(client) {

    let num

    if (selected.length == activities.length)
        selected = []

    // Ficará repetindo até o número não ter saído
    do {
        num = Math.round((activities.length - 1) * Math.random())
    } while (selected.includes(num))

    let tempo_minimo = 0

    // Tempo mínimo para atividade assistindo
    if (activities[num].type == 2)
        tempo_minimo = 45000

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
    }, 15000 + tempo_minimo + Math.round(5000 * Math.random()))
}