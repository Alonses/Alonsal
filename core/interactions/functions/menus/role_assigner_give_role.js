const { getRoleAssigner } = require('../../../database/schemas/Guild_role_assigner')

module.exports = async ({ client, user, interaction, dados }) => {

    const roles = [], caso = dados.split(".")[1]
    const guild_roles = await getRoleAssigner(interaction.guild.id, caso)

    // Invertendo os eventos
    Object.keys(interaction.values).forEach(indice => {
        roles.push(interaction.values[indice].split("|")[1].split(".")[0])
    })

    guild_roles.atribute = roles.length < 1 ? null : roles.join(".")
    await guild_roles.save()

    // Redirecionando o evento
    require('../../chunks/role_assigner')({ client, user, interaction, caso })
}