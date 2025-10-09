const { writeFileSync, readFile } = require('fs')

const { getActiveModules, shutdownAllUserModules } = require("../../database/schemas/Module.js")

const { week_days, moduleTypes } = require('../../formatters/patterns/user.js')
const formata_horas = require('../../formatters/formata_horas.js')

const lista_modulos = []
let trava_modulo = false

async function atualiza_modulos() {

    // Atualizando o arquivo de módulos configurados
    const dados = await getActiveModules()
    writeFileSync("./files/data/modules.txt", JSON.stringify(dados))
}

async function requisita_modulo(client) {

    // Impede que os bots de teste ativem os módulos
    if (!client.x.modules) return

    const data1 = new Date()
    const horario = formata_horas(data1.getHours() == 0 ? '0' : data1.getHours(), data1.getMinutes() === 0 ? '0' : data1.getMinutes()), dia = data1.getDay()

    readFile('./files/data/modules.txt', 'utf8', (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja módulos salvos em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {
            // Verificando se o horário está correto
            if (data[i].stats.days == 2 && data[i].stats.hour === horario)
                lista_modulos.push(data[i])

            // Verificando se o horário e o dia estão corretos
            else if (data[i].stats.days < 4 && (data[i].stats.hour === horario && week_days[data[i].stats.days].includes(dia)))
                lista_modulos.push(data[i])

            else if (data[i].stats.days > 2 && data[i].stats.hour === horario)
                if ((data[i].stats.days - 4) === dia) // Um dia específico
                    lista_modulos.push(data[i])
        }

        if (lista_modulos.length > 0)
            executa_modulo(client)
    })
}

executa_modulo = async (client) => {

    // Retorna caso o array de módulos esteja vazio
    if (lista_modulos.length < 1) return

    // Dispara os módulos agendados
    if (!trava_modulo) {
        trava_modulo = true

        const alvo = await (lista_modulos[0].misc.scope === "user" ? client.getUser(lista_modulos[0].uid) : client.getGuild(client.decifer(lista_modulos[0].misc.sid)))
        const internal_module = lista_modulos[0]

        if (internal_module.type === 2) {

            if (internal_module.data === 0) // Sem definição do tipo de envio
                if (lista_modulos[0].misc.scope === "user") await client.sendDM(alvo, { content: client.tls.phrase(alvo, "misc.modulo.faltando_tipo") }, true)

            // Definindo qual tipo de anúncio do history será
            let dados = {
                data: "",
                especifico: "acon=1"
            }

            // History no modo resumido
            if (internal_module.data === 2 || !internal_module.data) {
                dados = {
                    data: "",
                    especifico: "acon=1"
                }
            }

            await require('../../formatters/chunks/model_history.js')({ client, alvo, dados, internal_module })
        } else if (moduleTypes[internal_module.type]) // Executando o módulo selecionado
            await require(`../../formatters/chunks/model_${moduleTypes[internal_module.type]}`)({ client, alvo, internal_module })

        lista_modulos.shift()

        setTimeout(() => {
            trava_modulo = false

            if (lista_modulos.length > 0)
                executa_modulo(client)
        }, 5000)
    }
}

async function cobra_modulo(client) {

    // Impede que os bots de teste cobrem módulos
    if (!client.x.modules) return

    const users = {}, modules = {}, data1 = new Date()
    const active_modules = await getActiveModules()

    // Somando todos os módulos ativos em chaves únicas por ID de usuário
    active_modules.forEach(modulo => {

        // Desativando o módulo vitrine caso o dono não tenha mais status de assinante
        if (!client.cached.subscribers.has(modulo.uid) && modulo.rotative.active) {
            modulo.rotative.active = false
            modulo.rotative.mid = null
            modulo.save()
        }

        // Considera apenas os módulos que são ativos no dia corrente e desconta do usuário conforme nível de subscrição do usuário
        if (modulo.stats.days == 2 || week_days[modulo.stats.days]?.includes(data1.getDay()) || modulo.stats.days - 4 === data1.getDay()) {
            if (users[modulo.uid]) {
                users[modulo.uid] += client.cached.subscribers.has(modulo.uid) ? modulo.stats.price * client.cached.subscriber_discount : modulo.stats.price
                modules[modulo.uid]++
            } else {
                users[modulo.uid] = client.cached.subscribers.has(modulo.uid) ? modulo.stats.price * client.cached.subscriber_discount : modulo.stats.price
                modules[modulo.uid] = 1
            }
        }
    })

    const ids = Object.keys(users)
    ids.forEach(async identificador => {

        const user = await client.getUser(identificador)
        user.misc.money -= users[identificador]
        let total = users[identificador]

        await user.save()

        // Desliga todos os módulos do usuário caso ele não tenha Bufunfas
        if (user.misc.money < users[identificador]) {
            shutdownAllUserModules(identificador)

            // Avisando o usuário sobre o desligamento dos módulos
            return client.sendDM(user, { content: client.tls.phrase(user, "misc.modulo.auto_desativado", client.emoji(30)) }, true)
        }

        // Registrando as movimentações de bufunfas para o usuário
        await client.registryStatement(user.uid, `misc.b_historico.modulos|${modules[identificador]}`, false, users[identificador])
        await client.journal("reback", total)
    })
}

module.exports.atualiza_modulos = atualiza_modulos
module.exports.requisita_modulo = requisita_modulo
module.exports.cobra_modulo = cobra_modulo