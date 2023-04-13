const { writeFileSync } = require('fs')
const fs = require('fs')

const { getActiveModules } = require("../database/schemas/Module")
const formata_clima = require('../formatadores/formata_clima')

const lista_modulos = []
let trava_modulo = false

const week_days = {
    0: [1, 2, 3, 4, 5],
    1: [6, 0]
}

module.exports = async ({ client }) => {

    if (!client.x.modules) return

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    if (client.id() === process.env.client_1)
        client.notify(process.env.channel_feeds, `:mega: :sparkles: | Módulos ativos, frequência de atualização de \`60\` segundos`)

    atualiza_modulos(client, tempo_restante)
}

function verifica_modulo(client, tempo_restante) {

    setTimeout(() => {
        requisita_modulo(client)
        verifica_modulo(client, 60000)
    }, tempo_restante)
}

async function atualiza_modulos(client, tempo_restante, auto) {

    const dados = await getActiveModules()

    writeFileSync("./arquivos/data/modules.txt", JSON.stringify(dados))

    if (dados.length > 0 && typeof auto === "undefined")
        setTimeout(() => {
            verifica_modulo(client, 60000)
        }, tempo_restante) // Executa de 60 em 60 segundos
}

async function requisita_modulo(client) {

    const data1 = new Date()
    const horario = `${data1.getHours()}:${data1.getMinutes()}`, dia = data1.getDay()

    fs.readFile('./arquivos/data/modules.txt', 'utf8', function (err, data) {

        data = JSON.parse(data)

        for (let i = 0; i < data.length; i++) {
            // Verificando se o horário está correto
            if (data[i].stats.days == 2 && data[i].stats.hour === horario)
                lista_modulos.push({ uid: data[i].uid, type: data[i].type })

            // Verificando se o horário e o dia estão corretos
            else if (data[i].stats.hour === horario && week_days[data[i].stats.days].includes(dia))
                lista_modulos.push({ uid: data[i].uid, type: data[i].type })
        }

        if (lista_modulos.length > 1)
            executa_modulo(client)
    })
}

async function executa_modulo(client) {

    // Dispara os módulos agendados
    if (!trava_modulo) {
        trava_modulo = true

        const user = await client.getUser(lista_modulos[0].uid)

        if (lista_modulos[0].type === 0)
            await formata_clima(client, user, null, true)

        setTimeout(() => {
            lista_modulos.shift()
            trava_modulo = false

            if (lista_modulos.length > 0)
                executa_modulo(client)
        }, 1000)
    }
}

module.exports.atualiza_modulos = atualiza_modulos