const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../data/badges')

const { faustop, rasputia, galerito } = require('../../../arquivos/json/text/emojis.json')
const { emojis } = require('../../../arquivos/json/text/emojis.json')

function create_menus(client, interaction, user, dados) {

    const itens_menu = []
    let insersoes = [], i = 1

    // Percorrendo as entradas informadas
    dados.values.forEach(valor => {

        // Montando a lista de valores para escolher conforme o alvo de entrada
        if (!insersoes.includes(valor)) {

            let nome_label, emoji_label, descricao_label, valor_label

            if (dados.alvo === "badges") {
                const badge = busca_badges(client, badgeTypes.SINGLE, valor)

                nome_label = badge.name
                emoji_label = badge.emoji
                descricao_label = `${client.tls.phrase(user, "dive.badges.fixar")} ${badge.name}`
                valor_label = `${dados.alvo}|${interaction.user.id}.${valor}`
            }

            if (dados.alvo === "faustop" || dados.alvo === "norbit" || dados.alvo === "galerito") {

                nome_label = valor

                if (dados.alvo === "faustop")
                    emoji_label = client.emoji(faustop)
                else if (dados.alvo === "norbit")
                    emoji_label = client.emoji(rasputia)
                else
                    emoji_label = client.emoji(galerito)

                // Descrição da opção no menu
                descricao_label = "Escolher essa do faustop"

                if (dados.alvo === "norbit")
                    descricao_label = "Escolher essa do filme Norbit"

                if (dados.alvo === "galerito")
                    descricao_label = "Escolher essa da rogéria"

                valor_label = `${dados.alvo}|${interaction.user.id}.${i - 1}`
            }

            if (dados.alvo.includes("dado")) {

                nome_label = client.tls.phrase(user, `manu.data.selects.${valor}`)
                emoji_label = client.defaultEmoji("paper")
                descricao_label = client.tls.phrase(user, "menu.menus.escolha_mais_detalhes")
                valor_label = `data|${interaction.user.id}.${valor}`
            }

            if (dados.alvo === "tarefas" || dados.alvo === "tarefa_visualizar") {

                // Listando tarefas
                nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text

                emoji_label = valor.concluded ? client.emoji(emojis.mc_approve) : client.emoji(emojis.mc_oppose)
                descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.concluded ? client.tls.phrase(user, "util.tarefas.finalizada") : client.tls.phrase(user, "util.tarefas.em_aberto")}`

                if (dados.alvo == "tarefas") {
                    emoji_label = client.defaultEmoji("paper")
                    descricao_label = `${client.tls.phrase(user, "util.tarefas.criacao")} ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")}`
                }

                valor_label = `${dados.alvo}|${valor.uid}.${valor.timestamp}.${dados.operador}`
            }

            if (dados.alvo.includes("listas")) {

                // Listando listas de tarefas -> Usado para linkar tarefas em listas criadas
                nome_label = valor.name.length > 15 ? `${valor.name.slice(0, 25)}...` : valor.name
                emoji_label = client.defaultEmoji("paper")
                descricao_label = client.tls.phrase(user, "util.tarefas.selecionar_lista")
                valor_label = `${dados.alvo}|${valor.uid}.${valor.timestamp}.${dados.timestamp}`

                // valor.timestamp -> timestamp da lista
                // dados.timestamp -> timestamp da tarefa
            }

            if (dados.alvo === "modulo_visualizar") {
                // Listando listas de tarefas -> Usado para linkar tarefas em listas criadas
                nome_label = `${client.tls.phrase(user, `misc.modulo.modulo_${valor.type}`)}`
                emoji_label = valor.stats.active ? client.emoji(emojis.mc_approve) : client.emoji(emojis.mc_oppose)
                descricao_label = `${client.tls.phrase(user, `misc.modulo.ativacao_${valor.stats.days}`)} às ${valor.stats.hour}`
                valor_label = `${dados.alvo}|${valor.uid}.${valor.stats.timestamp}.${valor.type}`
            }

            i++

            itens_menu.push({
                label: nome_label,
                emoji: emoji_label,
                description: descricao_label,
                value: `${valor_label}`
            })

            insersoes.push(valor)
        }
    })

    // Definindo titulos e ID's exclusivos para diferentes comandos
    let titulo_menu = client.tls.phrase(user, "dive.badges.escolha_uma")
    let id_menu = `select_${dados.alvo}_${interaction.user.id}`

    if (dados.alvo === "faustop")
        titulo_menu = "Escolha uma frase do faustão!"

    if (dados.alvo === "norbit")
        titulo_menu = "Escolha uma frase do filme do Norbit!"

    if (dados.alvo === "galerito")
        titulo_menu = "Escolha uma frase do galerito e cia!"

    if (dados.alvo.includes("tarefa"))
        titulo_menu = client.tls.phrase(user, "util.tarefas.escolher_tarefa_visualizar")

    if (dados.alvo === "modulo_visualizar")
        titulo_menu = "Escolha um dos módulos abaixo"

    if (dados.alvo === "listas")
        titulo_menu = client.tls.phrase(user, "util.tarefas.escolher_lista_vincular")

    if (dados.alvo === "listas_navegar")
        titulo_menu = client.tls.phrase(user, "util.tarefas.escolher_lista_navegar")

    if (dados.alvo === "dados_navegar")
        titulo_menu = client.tls.phrase(user, "manu.data.tipo_dado")

    if (dados.alvo === "listas_remover")
        titulo_menu = client.tls.phrase(user, "util.tarefas.escolher_lista_apagar")

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
        )

    return row
}

module.exports = {
    create_menus
}