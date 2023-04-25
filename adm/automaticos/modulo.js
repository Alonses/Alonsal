const fs = require('fs')

const { writeFileSync } = require('fs')
const { getActiveModules } = require("../database/schemas/Module")

const model_clima = require('../formatadores/chunks/model_clima')
const model_frase = require('../formatadores/chunks/model_frase.js')
const model_history = require('../formatadores/chunks/model_history')

const lista_modulos = []
let trava_modulo = false, global_client

const week_days = {
    0: [1, 2, 3, 4, 5],
    1: [6, 0]
}

module.exports = async ({ client }) => {

    if (!client.x.modules) return

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
            verifica_modulo(tempo_restante)
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
            await model_clima(global_client, user, null, true)

        if (lista_modulos[0].type === 1)
            await model_frase(global_client, user)

        if (lista_modulos[0].type === 2) {

            if (!lista_modulos[0].data) // Sem definição de tipo de envio
                await global_client.sendDM(user, "Você não definiu se o módulo do history será resumido ou completo\nPor padrão, enviarei uma versão resumida para você!", true)

            // Definindo qual tipo de anúncio do history será
            let dados = {
                data: "",
                especifico: "acon=1"
            }

            // History resumido
            if (lista_modulos[0].data === 2 || !lista_modulos[0].data) {
                dados = {
                    data: "",
                    especifico: "acon=1"
                }
            }

            await model_history(global_client, user, null, dados)
        }

        lista_modulos.shift()

        setTimeout(() => {
            trava_modulo = false

            if (lista_modulos.length > 0)
                executa_modulo()
        }, 1000)
    }
}

module.exports.atualiza_modulos = atualiza_modulos