const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges')
const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = (client, dados, interaction) => {

    const opcoes = []
    let insersoes = []

    dados.forEach(valor => {
        let badge = busca_badges(client, 'single', valor, interaction)

        if (!insersoes.includes(valor)) {
            opcoes.push({
                label: `${badge[1]}`,
                emoji: `${busca_emoji(client, badge[0])}`,
                description: `${client.tls.phrase(client, interaction, "dive.badges.fixar")} ${badge[1]}`,
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