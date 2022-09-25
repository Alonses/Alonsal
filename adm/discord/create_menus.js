const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges')
const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = (client, dados, interaction) => {

    const opcoes = []

    dados.forEach(valor => {
        let badge = busca_badges(client, 'single', valor)

        opcoes.push({
            label: `${badge[1]}`,
            emoji: `${busca_emoji(client, badge[0])}`,
            description: `Fixar a badge ${badge[1]}`,
            value: `${valor}`
        })
    })

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(`select_${interaction.user.id}`)
                .setPlaceholder('Selecione uma badge!')
                .addOptions(opcoes)
        )

    return row
}