const { busca_badges, badgeTypes } = require('../../../data/badges')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    // Fixando a badge escolhida pelo usuário
    user.misc.fixed_badge = escolha

    await user.save()
    let new_badge = busca_badges(client, badgeTypes.SINGLE, escolha)

    interaction.update({
        content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`,
        components: [],
        ephemeral: true
    })
}