const { atualiza_fixed_badges } = require('../../../auto/triggers/user_fixed_badges')
const { busca_badges } = require('../../../data/user_badges')

const { badgeTypes } = require('../../../formatters/patterns/user')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    // Fixando a badge escolhida pelo usuário
    user.misc.fixed_badge = escolha
    await user.save()

    const new_badge = busca_badges(client, badgeTypes.SINGLE, escolha)

    // Atualizando a lista de badges fixas em cache
    atualiza_fixed_badges(client)

    interaction.update({
        content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`,
        components: [],
        ephemeral: true
    })
}