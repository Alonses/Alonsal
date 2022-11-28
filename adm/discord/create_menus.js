const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const {busca_badges, badgeTypes} = require('../../adm/data/badges')

module.exports = (client, dados, interaction) => {

    const opcoes = []
    let insersoes = []

    dados.forEach(valor => {
        const badge = busca_badges(client, badgeTypes.SINGLE, valor)

        if (!insersoes.includes(valor)) {
            opcoes.push({
                label: `${badge.name}`,
                emoji: `${badge.emoji}`,
                description: `${client.tls.phrase(client, interaction, "dive.badges.fixar")} ${badge.name}`,
                value: `${valor}`
            })

            insersoes.push(valor)
        }
    })

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(`select_${interaction.user.id}`)
                .setPlaceholder(client.tls.phrase(client, interaction, "dive.badges.escolha_uma"))
                .addOptions(opcoes)
        )

    return row
}