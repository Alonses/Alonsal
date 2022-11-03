const busca_emoji = require("../discord/busca_emoji")
const busca_badges = require('../data/badges')

module.exports = ({ client, interaction }) => {

    if (interaction.customId == `select_${interaction.user.id}`) {

        const user = client.usuarios.getUser(interaction.user.id)
        user.badges.fixed_badge = interaction.values[0]

        client.usuarios.saveUser(user)
        let new_badge = busca_badges(client, 'single', parseInt(interaction.values[0]))

        interaction.update({ content: `${busca_emoji(client, new_badge[0])} | Badge \`${new_badge[1]}\` ${client.tls.phrase(client, interaction, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })
    }
}