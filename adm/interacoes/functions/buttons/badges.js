const { emojis_dancantes } = require('../../../../arquivos/json/text/emojis.json')

const { createBadge } = require('../../../database/schemas/Badge')
const { busca_badges, badgeTypes } = require('../../../data/badges')

module.exports = async ({ client, user, interaction, dados }) => {

    // Atribuindo badges a usuários
    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar e notificar
    // 2 -> Confirmar silenciosamente

    // Cancelando a atribuição da badge
    if (!operacao)
        return interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    const id_alvo = interaction.customId.split("|")[2].split(".")[0]
    const badge_alvo = parseInt(interaction.customId.split("|")[2].split(".")[1])

    // Atribuindo a badge ao usuário
    await createBadge(id_alvo, badge_alvo, client.timestamp())

    const badge = busca_badges(client, badgeTypes.SINGLE, badge_alvo)

    client.discord.users.fetch(id_alvo, false).then(async (user_interno) => {
        const alvo = await client.getUser(id_alvo)

        // Atribuindo e notificando
        if (operacao === 1) {

            if (client.decider(alvo?.conf.ghost_mode, 1))
                client.sendDM(alvo, `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(alvo, "dive.badges.new_badge").replace("nome_repl", badge.name).replace("emoji_repl", badge.emoji)}`)

            interaction.update({ content: `${client.emoji(emojis_dancantes)} | Badge \`${badge.name}\` ${badge.emoji} atribuída ao usuário ${user_interno}!`, embeds: [], components: [], ephemeral: true })
        } else // Atribuindo silenciosamente
            interaction.update({ content: `${client.emoji(emojis_dancantes)} | Badge \`${badge.name}\` ${badge.emoji} atribuída silenciosamente ao usuário ${user_interno}!`, embeds: [], components: [], ephemeral: true })
    })
}