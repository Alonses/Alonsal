const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const { getUser } = require("../database/schemas/User.js")

module.exports = async ({ client, interaction }) => {

    if (interaction.customId === `select_${interaction.user.id}`) {

        const user = await getUser(interaction.user.id)
        user.badges.fixed_badge = interaction.values[0]

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(interaction.values[0]))

        interaction.update({ content: `${client.emoji(new_badge[0])} | Badge \`${new_badge[1]}\` ${client.tls.phrase(client, interaction, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })
    }
}