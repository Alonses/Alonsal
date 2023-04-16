const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const { fausto, rasputia, galerito } = require('../../arquivos/json/text/emojis.json')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = (alvo, client, interaction, user, dados, timestamp) => {

    const itens_menu = []
    let insersoes = [], i = 1

    // Percorrendo as entradas informadas
    dados.forEach(valor => {

        // Montando a lista de valores para escolher conforme o alvo de entrada
        if (!insersoes.includes(valor)) {

            let nome_label, emoji_label, descricao_label, valor_label

            if (alvo === "badges") {
                const badge = busca_badges(client, badgeTypes.SINGLE, valor)

                nome_label = badge.name
                emoji_label = badge.emoji
                descricao_label = `${client.tls.phrase(user, "dive.badges.fixar")} ${badge.name}`
                valor_label = valor
            }

            if (alvo === "fausto" || alvo === "norbit" || alvo === "galerito") {

                nome_label = valor

                if (alvo === "fausto")
                    emoji_label = client.emoji(fausto)
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

                valor_label = i - 1
            }

            if (alvo == "data") {

                nome_label = `data ${i}`
                emoji_label = client.emoji(fausto)
                descricao_label = `data ${i}`
                valor_label = i
            }

            i++
            if (alvo === "tasks" || alvo === "tasks_v") {

                // Listando tarefas
                nome_label = valor.text.length > 15 ? `${valor.text.slice(0, 25)}...` : valor.text

                emoji_label = valor.concluded ? client.emoji(emojis.mc_approve) : client.emoji(emojis.mc_oppose)
                descricao_label = `Criado em ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.concluded ? "Finalizada" : "Em aberto"}`

                if (alvo == "tasks") {
                    emoji_label = client.defaultEmoji("paper")
                    descricao_label = `Criado em ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")}`
                }

                valor_label = `${valor.uid}.${valor.timestamp}`
            }

            if (alvo === "groups" || alvo === "groups_n" || alvo === "groups_r") {

                // Listando listas de tarefas
                nome_label = valor.name.length > 15 ? `${valor.name.slice(0, 25)}...` : valor.name
                emoji_label = client.defaultEmoji("paper")
                descricao_label = "Selecionar essa lista"
                valor_label = `${valor.uid}#${timestamp}.${valor.timestamp}`
            }

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
    let id_menu = `select_${alvo}_${interaction.user.id}`

    if (alvo === "fausto")
        titulo_menu = "Escolha uma frase do faustão!"

    if (alvo === "norbit")
        titulo_menu = "Escolha uma frase do filme do Norbit!"

    if (alvo === "galerito")
        titulo_menu = "Escolha uma frase do galerito e cia!"

    if (alvo === "tasks" || alvo === "tasks_v")
        titulo_menu = "Escolha uma das tarefas para mais detalhes!"

    if (alvo === "groups")
        titulo_menu = "Escolha uma das listas para vincular esta!"

    if (alvo === "groups_n")
        titulo_menu = "Escolha uma das listas para ver suas tarefas"

    if (alvo === "groups_r")
        titulo_menu = "Escolha uma das listas para apagar"

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
        )

    return row
}