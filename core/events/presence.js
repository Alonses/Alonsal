const { ActivityType } = require('discord.js')

const { activities } = require('../../files/json/text/activities.json')

let selected = []

const actionTypes = [ActivityType.Playing, ActivityType.Watching, ActivityType.Listening]

module.exports = async ({ client }) => {

    // Impede que o bot atualize o status
    if (client.x.force_update) return

    if (client.x.status) {
        setTimeout(() => {
            requisita_status(client)
        }, 10000)
    } else
        client.user().setActivity("💣 Baidu explosivo", { type: ActivityType.Playing })
}

async function requisita_status(client) {

    let num

    if (selected.length === activities.length)
        selected = []

    do { // Repetirá enquanto o número já tiver sido escolhido
        num = client.execute("random", { intervalo: activities })
    } while (selected.includes(num))

    let tempo_minimo = 0

    // Tempo mínimo para atividade "ouvindo"
    if (activities[num].type === 2)
        tempo_minimo = client.execute("random", { intervalo: 50000, base: 60000 })

    // Tempo mínimo para atividade "assistindo"
    if (activities[num].type === 1)
        tempo_minimo = client.execute("random", { intervalo: 50000, base: 80000 })

    let texto_status = activities[num].text

    if (texto_status.includes("server_repl"))
        texto_status = texto_status.replace("server_repl", client.execute("locale", { valor: client.guilds().size }))

    if (texto_status.includes("canais_repl"))
        texto_status = texto_status.replace("canais_repl", client.execute("locale", { valor: client.channels(0).size }))

    if (texto_status.includes("activities_repl"))
        texto_status = texto_status.replace("activities_repl", client.execute("locale", { valor: activities.length }))

    if (texto_status.includes("version_repl")) {
        const bot = await client.getBot()
        texto_status = texto_status.replace("version_repl", client.execute("locale", { valor: bot.persis.version }))
    }

    if (texto_status.includes("commands_repl")) {
        const bot = await client.getBot()
        texto_status = texto_status.replace("commands_repl", client.execute("locale", { valor: bot.persis.commands }))
    }

    // Exibindo o status personalizado de forma aleatória por um tempo
    client.user().setActivity(texto_status, { type: actionTypes[activities[num].type] })
    client.cached.presence = num // Registrando o número do status atual

    // Solicitando um novo status personalizado
    timeout_presence = setTimeout(() => {
        requisita_status(client)
    }, 15000 + client.execute("random", { intervalo: 5000, base: tempo_minimo }))
}

module.exports.requisita_status = requisita_status