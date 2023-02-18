const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const { fausto } = require('../../arquivos/json/text/emojis.json')

module.exports = (alvo, client, interaction, user, dados) => {

    const itens_menu = []
    let insersoes = [], i = 1;

    // Percorrendo as entradas informadas
    dados.forEach(valor => {

        // Montando a lista de badges para escolher
        if (alvo == "badges") {
            const badge = busca_badges(client, badgeTypes.SINGLE, valor)

            if (!insersoes.includes(valor)) {
                itens_menu.push({
                    label: `${badge.name}`,
                    emoji: `${badge.emoji}`,
                    description: `${client.tls.phrase(user, "dive.badges.fixar")} ${badge.name}`,
                    value: `${valor}`
                })

                insersoes.push(valor)
            }
        } else if (alvo == "fausto") {

            // Montando a lista de sons do faustão para escolher
            if (!insersoes.includes(valor)) {
                itens_menu.push({
                    label: valor,
                    emoji: `${client.emoji(fausto)}`,
                    description: `Escolher essa do faustop`,
                    value: `${i - 1}`
                })

                insersoes.push(valor)
                i++
            }
        }
    })

    // Definindo titulos e ID's exclusivos para diferentes comandos
    let titulo_menu = client.tls.phrase(user, "dive.badges.escolha_uma")
    let id_menu = `select_${alvo}_${interaction.user.id}`

    if (alvo == "fausto")
        titulo_menu = "Escolha uma frase do faustão!"

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
        )

    return row
}