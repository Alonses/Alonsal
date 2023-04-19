const fs = require('fs')

const { writeFileSync } = require('fs')
const { getActiveModules } = require("../database/schemas/Module")

const formata_clima = require('../formatadores/formata_clima')
const formata_frase = require('../formatadores/formata_frase.js')

const lista_modulos = []
let trava_modulo = false, global_client

const week_days = {
    0: [1, 2, 3, 4, 5],
    1: [6, 0]
}

module.exports = async ({ client }) => {

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    global_client = client

    if (tempo_restante > 1000)
        console.log(`📣 Disparando os módulos em ${tempo_restante} segundos`)
    else
        console.log(`📣 Disparando os módulos agora!`)

    atualiza_modulos(global_client, tempo_restante)
}

async function atualiza_modulos(client, tempo_restante, auto) {

    const dados = await getActiveModules()
    global_client = client

    writeFileSync("./arquivos/data/modules.txt", JSON.stringify(dados))

    if (dados.length > 0 && typeof auto === "undefined")
        setTimeout(() => {
            verifica_modulo(60000)
        }, tempo_restante) // Executa de 60 em 60 segundos

    if (dados.length < 1)
        global_client.notify(process.env.channel_feeds, `:mega: :sparkles: | Módulos desativados, não há módulos ativos no momento.`)
}

function verifica_modulo(tempo_restante) {

    setTimeout(() => {
        requisita_modulo()
        verifica_modulo(60000)
    }, tempo_restante)
}

async function requisita_modulo() {

    const data1 = new Date()
    const horario = `${data1.getHours()}:${data1.getMinutes()}`, dia = data1.getDay()

    fs.readFile('./arquivos/data/modules.txt', 'utf8', function (err, data) {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja módulos listados em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {
            // Verificando se o horário está correto
            if (data[i].stats.days == 2 && data[i].stats.hour === horario)
                lista_modulos.push({ uid: data[i].uid, type: data[i].type })

            // Verificando se o horário e o dia estão corretos
            else if (data[i].stats.hour === horario && week_days[data[i].stats.days].includes(dia))
                lista_modulos.push({ uid: data[i].uid, type: data[i].type })
        }

        if (lista_modulos.length > 0)
            executa_modulo()
    })
}

async function executa_modulo() {

    // Retorna caso o array de módulos esteja vazio
    if (lista_modulos.length < 1) return

    // Dispara os módulos agendados
    if (!trava_modulo) {
        trava_modulo = true

        const user = await global_client.getUser(lista_modulos[0].uid)

        if (lista_modulos[0].type === 0)
            await formata_clima(global_client, user, null, true)

        if (lista_modulos[0].type === 1)
            await formata_frase(global_client, user)

        lista_modulos.shift()

        setTimeout(() => {
            trava_modulo = false

            if (lista_modulos.length > 0)
                executa_modulo()
        }, 1000)
    }
}

module.exports.atualiza_modulos = atualiza_modulos