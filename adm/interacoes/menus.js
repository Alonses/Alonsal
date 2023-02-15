const { busca_badges, badgeTypes } = require('../../adm/data/badges')

module.exports = async ({ client, user, interaction }) => {

    if (interaction.customId === `select_${interaction.user.id}`) {

        user.badges.fixed_badge = interaction.values[0]

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(interaction.values[0]))

        interaction.update({ content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })
    }
}