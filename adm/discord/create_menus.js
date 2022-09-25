const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

const busca_badges = require('../../adm/data/badges')
const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = (client, dados, interaction) => {

    const opcoes = []
    const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

    let insersoes = []

    dados.forEach(valor => {
        let badge = busca_badges(client, 'single', valor)

        if (!insersoes.includes(valor)) {
            opcoes.push({
                label: `${badge[1]}`,
                emoji: `${busca_emoji(client, badge[0])}`,
                description: `${diversao[9]["fixar"]} ${badge[1]}`,
                value: `${valor}`
            })

            insersoes.push(valor)
        }
    })

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(`select_${interaction.user.id}`)
                .setPlaceholder(diversao[9]["escolha_uma"])
                .addOptions(opcoes)
        )

    return row
}