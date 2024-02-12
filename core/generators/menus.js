const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../data/badges')

const { faustop, rasputia, galerito } = require('../../files/json/text/emojis.json')
const { colorsMap } = require('../database/schemas/User')
const { languagesMap } = require('../formatters/translate')
const { loggerMap } = require('../database/schemas/Guild')
const { moduleDays } = require('../database/schemas/Module')

const translate = {
    "faustop": "Escolha uma frase do faustão!",
    "norbit": "Escolha uma frase do filme do Norbit!",
    "galerito": "Escolha uma frase do galerito e cia!",
    "modules_browse": "misc.modulo.selecionar_modulo",
    "listas": "util.tarefas.escolher_lista_vincular",
    "listas_navegar": "util.tarefas.escolher_lista_navegar",
    "dados_navegar": "manu.data.tipo_dado",
    "listas_remover": "util.tarefas.escolher_lista_apagar",
    "tarefas_remover": "util.tarefas.escolher_tarefa_apagar",
    "profile_custom_navegar": "menu.menus.selecionar_profile",
    "choose_language": "Choose a language!",
    "guild_spam_timeout": "menu.menus.escolher_timeout",
    "guild_warns_reset": "menu.menus.escolher_timeout",
    "warn_config_timeout": "menu.menus.escolher_timeout",
    "data_guild_timeout": "menu.menus.escolher_timeout",
    "guild_spam_strikes": "menu.menus.escolher_numero",
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

function create_menus({ client, interaction, user, data, pagina, multi_select, guild }) {

    const itens_menu = [], alvo = data.alvo
    let insersoes = [], i = 0, indice_start = pagina * 24 || 0

    if (pagina > 0) // Acrescenta um indice para evitar duplicatas
        indice_start++

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

            if (alvo === "modules_browse") {
                // Listando listas de tarefas -> Usado para linkar tarefas em listas criadas
                nome_label = `${client.tls.phrase(user, `misc.modulo.modulo_${valor.type}`)}`
                emoji_label = valor.stats.active ? client.emoji("mc_approve") : client.emoji("mc_oppose")
                descricao_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor.stats.days}`)} ${valor.stats.hour}`
                valor_label = `${alvo}|${valor.uid}.${valor.stats.timestamp}.${valor.type}`
            }

            if (alvo === "modules_select_day") {
                // Listando as opções de dia para escolha
                nome_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor}`)}`
                emoji_label = moduleDays[valor]
                valor_label = `${alvo}|${interaction.user.id}.${data.timestamp}.${valor}`
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

            if (alvo === "guild_spam_timeout" || alvo === "guild_warns_reset" || alvo === "guild_spam_strikes" || alvo === "warn_config_timeout" || alvo === "data_guild_timeout") {
                // Listando as opções de tempo de mute para o anti-spam
                emoji_label = client.defaultEmoji("time")
                valor_label = `${alvo}|${i + 1}`

                if (data.submenu) // Função com um submenu inclusa
                    valor_label = `${alvo}|${i + 1}.${data.submenu}`

                // Exibindo apenas o número
                if (alvo === "guild_spam_strikes")
                    nome_label = valor
                else
                    nome_label = client.tls.phrase(user, `menu.times.${valor}`)

                // Usado para a quantidade de repetências dos warns
                if (alvo === "guild_spam_strikes")
                    valor_label = `${alvo}|${valor}`
            }

            if (alvo.includes("#")) {
                // Listando todos os canais, categorias e cargos para seleção
                if (alvo.includes("#role")) { // Cargos
                    nome_label = valor.name.length < 20 ? valor.name : `${valor.name.slice(0, 15)}...`
                    emoji_label = client.defaultEmoji("role")
                    valor_label = `${alvo.replace("#", "_")}|${valor.id}`

                    if (valor.id === "all")
                        emoji_label = "🃏"

                    if (alvo.includes("warn_config")) // Definindo uma punição para as advertências
                        valor_label = `${alvo.replace("#", "_")}|${valor.id}.${data.submenu.replace("x/", "")}`

                } else if (alvo.includes("#language")) { // Idioma
                    nome_label = languagesMap[valor][2]
                    emoji_label = languagesMap[valor][3]
                    valor_label = `${alvo.replace("#", "_")}|${valor}`
                } else if (alvo.includes("#events")) { // Eventos variados
                    nome_label = `${loggerMap[valor.type]} ${client.tls.phrase(user, `menu.events.${valor.type}`)}`
                    emoji_label = valor.status ? client.emoji("mc_approve") : client.emoji("mc_oppose")
                    valor_label = `${alvo.replace("#", "_")}|${valor.type}`
                    descricao_label = valor.status ? client.tls.phrase(user, "menu.status.ativado") : client.tls.phrase(user, "menu.status.desativado")

                    if (alvo.includes("warn_config")) // Definindo uma punição para as advertências
                        valor_label = `${alvo.replace("#", "_")}|${valor.type}.${valor.id_warn}`

                    if (data.submenu) // Função com um submenu inclusa
                        valor_label = `${alvo.replace("#", "_")}|${valor.type}.${data.submenu}`

                } else if (alvo.includes("#link")) { // Linkagem de servidores
                    nome_label = valor.name.length > 20 ? `${valor.name.slice(0, 18)}...` : valor.name
                    emoji_label = valor.network.link ? client.emoji(44) : client.emoji("mc_oppose")
                    descricao_label = valor.network.link ? client.tls.phrase(user, "mode.network.linkado") : client.tls.phrase(user, "mode.network.nao_linkado")
                    valor_label = `${alvo.replace("#", "_")}|${valor.sid}`
                } else { // Canais e categorias
                    nome_label = valor.name.length < 20 ? valor.name : `${valor.name.slice(0, 15)}...`

                    if (alvo === "guild_speaker#channel") {

                        // Verificando se o canal já está ativo e exibindo o emoji respectivo
                        emoji_label = client.emoji("mc_oppose")

                        if (guild.speaker.channels)
                            if (guild.speaker.channels.includes(valor.id))
                                emoji_label = client.emoji("mc_approve")
                    } else
                        emoji_label = client.defaultEmoji("channel")

                    if (valor.id === "none") // Usado para remover o canal
                        emoji_label = client.emoji(13)

                    valor_label = `${alvo.replace("#", "_")}|${valor.id}`
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

                if (alvo === "remove_warn" || alvo == "warn_browse")
                    valor_label = `${alvo}|${valor.uid}.${valor.sid}.${valor.timestamp}.${pagina}`
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

    if (data.submenu) // Tempo para remover advertências
        if (data.submenu == 16)
            titulo_menu = "Defina o tempo para remover a advertência!"

    let min = 1, max = 1

    if (multi_select) // Menu com multi-seleção
        max = data.values.length - indice_start > 25 ? 25 : data.values.length - indice_start

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