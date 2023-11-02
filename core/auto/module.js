const fs = require('fs')

const { writeFileSync } = require('fs')

const { getUser } = require('../database/schemas/User')
const { getActiveModules, shutdownAllUserModules } = require("../database/schemas/Module")

const formata_horas = require('../formatters/formata_horas')

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
        console.log(`📣 | Disparando os módulos em ${tempo_restante} segundos`)
    else
        console.log(`📣 | Disparando os módulos agora!`)

    atualiza_modulos(global_client, tempo_restante)
}

async function atualiza_modulos(client, tempo_restante, auto) {

    const dados = await getActiveModules()
    global_client = client

    writeFileSync("./files/data/modules.txt", JSON.stringify(dados))

    if (dados.length > 0 && typeof auto === "undefined")
        setTimeout(() => {
            verifica_modulo(tempo_restante)
        }, tempo_restante) // Executa de 60 em 60 segundos

    if (dados.length < 1)
        global_client.notify(process.env.channel_feeds, { content: ":mega: :sparkles: | Módulos desativados, não há módulos ativos no momento." })
}

verifica_modulo = (tempo_restante) => {

    setTimeout(() => {
        requisita_modulo()
        verifica_modulo(60000)
    }, tempo_restante)
}

requisita_modulo = async () => {

    const data1 = new Date()
    const horario = formata_horas(data1.getHours() == 0 ? '0' : data1.getHours(), data1.getMinutes() === 0 ? '0' : data1.getMinutes()), dia = data1.getDay()

    fs.readFile('./files/data/modules.txt', 'utf8', (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja módulos listados em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {
            // Verificando se o horário está correto
            if (data[i].stats.days == 2 && data[i].stats.hour === horario)
                lista_modulos.push({
                    uid: data[i].uid,
                    type: data[i].type
                })

            // Verificando se o horário e o dia estão corretos
            else if (data[i].stats.hour === horario && week_days[data[i].stats.days].includes(dia))
                lista_modulos.push({
                    uid: data[i].uid,
                    type: data[i].type
                })
        }

        // let estagio = 1
        // let client = global_client

        // if (horario === "13:05")
        //     require("./close_voting")({ client, estagio })

        // if (horario === "13:30") {
        //     estagio = 2
        //     require("./close_voting")({ client, estagio })
        // }

        if (lista_modulos.length > 0)
            executa_modulo()
    })
}

executa_modulo = async () => {

    // Retorna caso o array de módulos esteja vazio
    if (lista_modulos.length < 1) return

    // Dispara os módulos agendados
    if (!trava_modulo) {
        trava_modulo = true

        const user = await global_client.getUser(lista_modulos[0].uid)

        if (lista_modulos[0].type === 0)
            await require('../formatters/chunks/model_weather')(global_client, user)

        if (lista_modulos[0].type === 1)
            await require('../formatters/chunks/model_frase.js')(global_client, user)

        if (lista_modulos[0].type === 2) {

            if (lista_modulos[0].data === 0) // Sem definição de tipo de envio
                await global_client.sendDM(user, { data: client.tls.phrase(user, "misc.modulo.faltando_tipo") }, true)

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

            await require('../formatters/chunks/model_history')(global_client, user, dados)
        }

        // Charadas
        if (lista_modulos[0].type === 3)
            await require('../formatters/chunks/model_charada')(global_client, user)

        // Curiosidades
        if (lista_modulos[0].type === 4)
            await require('../formatters/chunks/model_curiosidades')(global_client, user)

        lista_modulos.shift()

        setTimeout(() => {
            trava_modulo = false

            if (lista_modulos.length > 0)
                executa_modulo()
        }, 1000)
    }
}

async function cobra_modulo(client) {

    const users = {}, modules = {}, data1 = new Date()
    const active_modules = await getActiveModules()

    // Somando todos os módulos ativos em chaves únicas por ID de usuário
    active_modules.forEach(modulo => {

        // Considera apenas os módulos que são ativos no dia corrente e desconta do usuário
        if (modulo.stats.days == 2 || week_days[modulo.stats.days].includes(data1.getDay())) {
            if (users[modulo.uid]) {
                users[modulo.uid] += modulo.stats.price
                modules[modulo.uid]++
            } else {
                users[modulo.uid] = modulo.stats.price
                modules[modulo.uid] = 1
            }
        }
    })

    const ids = Object.keys(users)
    ids.forEach(async identificador => {

        const user = await getUser(identificador)
        user.misc.money -= users[identificador]
        let total = users[identificador]

        await user.save()

        // Desliga todos os módulos do usuário caso ele não tenha Bufunfas
        if (user.misc.money < users[identificador]) {
            shutdownAllUserModules(identificador)

            // Avisando o usuário sobre o desligamento dos módulos
            return client.sendDM(user, { data: client.tls.phrase(user, "misc.modulo.auto_desativado", client.emoji(30)) }, true)
        }

        // Registrando as movimentações de bufunfas para o usuário
        await client.registryStatement(user.uid, `misc.b_historico.modulos|${modules[identificador]}`, false, users[identificador])
        await client.journal("reback", total)
    })
}

module.exports.atualiza_modulos = atualiza_modulos
module.exports.cobra_modulo = cobra_modulo