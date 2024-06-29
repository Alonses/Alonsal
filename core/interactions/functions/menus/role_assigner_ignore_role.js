const { getRoleAssigner } = require('../../../database/schemas/Guild_role_assigner')

module.exports = async ({ client, user, interaction }) => {

    const roles = [], caso = "global"
    const guild_roles = await getRoleAssigner(interaction.guild.id, caso)

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        roles.push(interaction.values[indice].split("|")[1])
    })

    guild_roles.ignore = roles.length < 1 ? null : roles.join(".")
    await guild_roles.save()

    // Redirecionando o evento
    require('../../chunks/role_assigner')({ client, user, interaction, caso })
}