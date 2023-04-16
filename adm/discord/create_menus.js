const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const { fausto, rasputia } = require('../../arquivos/json/text/emojis.json')

module.exports = (alvo, client, interaction, user, dados) => {

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

            if (alvo === "fausto" || alvo === "norbit") {

                nome_label = valor

                if (alvo === "fausto")
                    emoji_label = client.emoji(fausto)
                else
                    emoji_label = client.emoji(rasputia)

                descricao_label = "Escolher essa do faustop"

                if (alvo === "norbit")
                    descricao_label = "Escolher essa do filme Norbit"

                valor_label = i - 1
            }

            if (alvo == "data") {

                nome_label = `data ${i}`
                emoji_label = client.emoji(fausto)
                descricao_label = `data ${i}`
                valor_label = i
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
    let id_menu = `select_${alvo}_${interaction.user.id}`

    if (alvo === "fausto")
        titulo_menu = "Escolha uma frase do faustão!"

    if (alvo === "norbit")
        titulo_menu = "Escolha uma frase do filme do Norbit!"

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
        )

    return row
}