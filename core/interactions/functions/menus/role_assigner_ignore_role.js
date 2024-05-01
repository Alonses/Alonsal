const { getRoleAssigner } = require('../../../database/schemas/Guild_role_assigner')

module.exports = async ({ client, user, interaction }) => {

    const guild_roles = await getRoleAssigner(interaction.guild.id)
    const roles = []

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        roles.push(interaction.values[indice].split("|")[1])
    })

    guild_roles.ignore = roles.join(".")

    if (roles.length < 1) // Sem cargos selecionados
        guild_roles.ignore = null

    await guild_roles.save()

    // Redirecionando o evento
    require('../../chunks/role_assigner')({ client, user, interaction })
}