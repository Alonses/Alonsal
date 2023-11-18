const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../data/badges')

const { faustop, rasputia, galerito } = require('../../files/json/text/emojis.json')
const { colorsMap } = require('../database/schemas/User')
const { languagesMap } = require('../formatters/translate')
const { loggerMap } = require('../database/schemas/Guild')

const translate = {
    "faustop": "Escolha uma frase do faustão!",
    "norbit": "Escolha uma frase do filme do Norbit!",
    "galerito": "Escolha uma frase do galerito e cia!",
    "modulo_visualizar": "misc.modulo.selecionar_modulo",
    "listas": "util.tarefas.escolher_lista_vincular",
    "listas_navegar": "util.tarefas.escolher_lista_navegar",
    "dados_navegar": "manu.data.tipo_dado",
    "listas_remover": "util.tarefas.escolher_lista_apagar",
    "tarefas_remover": "util.tarefas.escolher_tarefa_apagar",
    "profile_custom_navegar": "menu.menus.selecionar_profile",
    "choose_language": "Choose a language!",
    "guild_spam_timeout": "menu.menus.escolher_timeout",
    "guild_warns_timeout": "menu.menus.escolher_timeout",
    "guild_warns_strikes": "menu.menus.escolher_numero",
    "static_color": "menu.menus.escolher_cor",
    "select_channel": "menu.menus.escolher_canal",
    "select_category": "menu.menus.escolher_categoria",
    "select_role": "menu.menus.escolher_cargo",
    "select_language": "menu.menus.escolher_idioma",
    "select_events": "menu.menus.escolher_eventos",
    "select_link": "menu.menus.escolher_guilds",
    "remove_report": "menu.menus.escolher_usuario",
    "remove_warn": "menu.menus.escolher_usuario",
    "report_browse": "menu.menus.escolher_usuario",
    "warn_browse": "menu.menus.escolher_usuario"
}

function create_menus({ client, interaction, user, data, pagina, multi_select }) {

    const itens_menu = [], alvo = data.alvo
    let insersoes = [], i = 0, indice_start = pagina * 24 || 0

    // Percorrendo as entradas informadas
    for (let x = indice_start; x < data.values.length; x++) {

        const valor = data.values[x]

        // Montando a lista de valores para escolher conforme o alvo de entrada
        if (!insersoes.includes(valor)) {

            let nome_label, emoji_label, descricao_label, valor_label

            if (alvo === "badges") {
                const badge = busca_badges(client, badgeTypes.SINGLE, valor)

                nome_label = badge.name
                emoji_label = badge.emoji
                descricao_label = `${client.tls.phrase(user, "dive.badges.fixar")} ${badge.name}`
                valor_label = `${alvo}|${interaction.user.id}.${valor}`
            }

            if (alvo === "faustop" || alvo === "norbit" || alvo === "galerito") {

                nome_label = valor

                if (alvo === "faustop")
                    emoji_label = client.emoji(faustop)
                else if (alvo === "norbit")
                    emoji_label = client.emoji(rasputia)
                else
                    emoji_label = client.emoji(galerito)

                // Descrição da opção no menu
                descricao_label = "Escolher essa do faustop"

                if (alvo === "norbit")
                    descricao_label = "Escolher essa do filme Norbit"

                if (alvo === "galerito")
                    descricao_label = "Escolher essa da rogéria"

                valor_label = `${alvo}|${interaction.user.id}.${i}`
            }

            if (alvo.includes("dado")) {

                nome_label = client.tls.phrase(user, `manu.data.selects.${valor}`)
                emoji_label = client.defaultEmoji("paper")
                descricao_label = client.tls.phrase(user, "menu.menus.escolha_mais_detalhes")
                valor_label = `data|${interaction.user.id}.${valor}`
            }

            if (alvo === "tarefas" || alvo === "tarefa_visualizar") {

                // Listando tarefas
                nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text

                emoji_label = valor.concluded ? client.emoji("mc_approve") : client.emoji(40)
                descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

                if (alvo == "tarefas") {
                    emoji_label = client.defaultEmoji("paper")
                    descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")}`
                }

                valor_label = `${alvo}|${valor.uid}.${valor.timestamp}.${data.operador}`
            }

            if (alvo.includes("listas")) {

                // Listando listas de tarefas -> Usado para linkar tarefas em listas criadas
                nome_label = valor.name.length > 15 ? `${valor.name.slice(0, 25)}...` : valor.name
                emoji_label = client.defaultEmoji("paper")
                descricao_label = client.tls.phrase(user, "util.tarefas.selecionar_lista")
                valor_label = `${alvo}|${valor.uid}.${valor.timestamp}.${data.timestamp}`

                // valor.timestamp -> timestamp da lista
                // data.timestamp -> timestamp da tarefa
            }

            if (alvo === "tarefas_remover") {

                // Listando tarefas criadas -> Usado para escolher tarefas para remover
                nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text
                emoji_label = valor.concluded ? client.emoji("mc_approve") : client.emoji(40)
                valor_label = `${alvo}|${valor.uid}.${valor.timestamp}`

                descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

                // valor.timestamp -> timestamp da tarefa
            }

            if (alvo === "modulo_visualizar") {
                // Listando listas de tarefas -> Usado para linkar tarefas em listas criadas
                nome_label = `${client.tls.phrase(user, `misc.modulo.modulo_${valor.type}`)}`
                emoji_label = valor.stats.active ? client.emoji("mc_approve") : client.emoji("mc_oppose")
                descricao_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor.stats.days}`)} ${valor.stats.hour}`
                valor_label = `${alvo}|${valor.uid}.${valor.stats.timestamp}.${valor.type}`
            }

            if (alvo === "profile_custom_navegar") {
                // Listando todas as opções para customização de perfil
                nome_label = `Customização de perfil ${valor}`
                emoji_label = client.emoji(faustop)
                descricao_label = `Ver mais detalhes`
                valor_label = `${alvo}|${interaction.user.id}.${valor}`
            }

            if (alvo === "choose_language") {
                // Listando os idiomas para escolher
                nome_label = valor.split(".")[1]
                emoji_label = valor.split(".")[2]
                valor_label = `${alvo}|${valor.split(".")[0]}`
            }

            if (alvo === "guild_spam_timeout" || alvo === "guild_warns_timeout" || alvo === "guild_warns_strikes") {
                // Listando as opções de tempo de mute para o anti-spam
                nome_label = client.tls.phrase(user, `menu.times.${valor}`)
                emoji_label = client.defaultEmoji("time")
                valor_label = `${alvo}|${i + 1}`

                // Usado para a quantidade de repetências dos warns
                if (alvo === "guild_warns_strikes")
                    valor_label = `${alvo}|${valor}`
            }

            if (alvo.includes("#")) {
                // Listando todos os canais, categorias e cargos para seleção
                if (alvo.includes("#role")) { // Cargos
                    nome_label = valor.name.length < 20 ? valor.name : `${valor.name.slice(0, 15)}...`
                    emoji_label = client.defaultEmoji("role")
                    valor_label = `${alvo.replace("#", "_")}|${valor.id}`
                } else if (alvo.includes("#language")) { // Idioma
                    nome_label = languagesMap[valor][2]
                    emoji_label = languagesMap[valor][3]
                    valor_label = `${alvo.replace("#", "_")}|${valor}`
                } else if (alvo.includes("#events")) { // Eventos do logger
                    nome_label = `${loggerMap[valor.type]} ${client.tls.phrase(user, `menu.events.${valor.type}`)}`
                    emoji_label = valor.status ? client.emoji("mc_approve") : client.emoji("mc_oppose")
                    valor_label = `${alvo.replace("#", "_")}|${valor.type}`
                    descricao_label = valor.status ? client.tls.phrase(user, "menu.status.ativado") : client.tls.phrase(user, "menu.status.desativado")
                } else if (alvo.includes("#link")) { // Linkagem de servidores
                    nome_label = valor.name.length > 20 ? `${valor.name.slice(0, 18)}...` : valor.name
                    emoji_label = valor.network.link ? client.emoji(44) : client.emoji("mc_oppose")
                    descricao_label = valor.network.link ? client.tls.phrase(user, "mode.network.linkado") : client.tls.phrase(user, "mode.network.nao_linkado")
                    valor_label = `${alvo.replace("#", "_")}|${valor.sid}`
                } else { // Canais e categorias
                    nome_label = valor.split(".")[0].length < 20 ? valor.split(".")[0] : `${valor.split(".")[0].slice(0, 15)}...`
                    emoji_label = client.defaultEmoji("channel")
                    valor_label = `${alvo.replace("#", "_")}|${valor.split(".")[1]}`
                }
            }

            if (alvo === "static_color") {
                emoji_label = colorsMap[valor][2]
                valor_label = `${alvo}|${valor}`
                nome_label = `${valor.charAt(0).toUpperCase() + valor.slice(1)}`
            }

            if (alvo === "remove_report" || alvo === "remove_warn" || alvo === "report_browse" || alvo == "warn_browse") {
                // Listando todos os usuários com reportes no servidor
                nome_label = valor.nick ? (valor.nick.length > 20 ? `${valor.nick.slice(0, 20)}...` : valor.nick) : client.tls.phrase(user, "mode.report.apelido_desconhecido")
                descricao_label = `${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory.length < 10 ? valor.relatory : `${valor.relatory.slice(0, 10)}...`}`
                emoji_label = client.defaultEmoji("person")
                valor_label = `${alvo}|${valor.uid}.${valor.sid}.${pagina}`
            }

            i++

            itens_menu.push({
                label: nome_label,
                emoji: emoji_label,
                description: descricao_label,
                value: valor_label
            })

            insersoes.push(valor)
        }

        if (x == (24 + indice_start))
            break
    }

    // Definindo titulos e ID's exclusivos para diferentes comandos
    let titulo_menu = client.tls.phrase(user, "dive.badges.escolha_uma")
    let id_menu = `select_${alvo}_${interaction.user.id}`

    if (alvo.includes("tarefa"))
        titulo_menu = client.tls.phrase(user, "util.tarefas.escolher_tarefa_visualizar")

    if (alvo.includes("#"))
        titulo_menu = client.tls.phrase(user, translate[`select_${alvo.split("#")[1]}`])

    if (translate[alvo]) // Verificando qual será o menu inserido e adicionando uma frase
        if (translate[alvo].split(".").length > 1)
            titulo_menu = client.tls.phrase(user, translate[alvo])
        else
            titulo_menu = translate[alvo]

    let min = 1, max = 1

    if (multi_select) // Menu com multi-seleção
        max = data.values.length

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
                .setMinValues(min)
                .setMaxValues(max)
        )

    return row
}

module.exports.create_menus = create_menus