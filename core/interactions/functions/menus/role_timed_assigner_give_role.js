const { getTimedRoleAssigner } = require('../../../database/schemas/User_roles')

module.exports = async ({ client, user, interaction, dados }) => {

    const id_cargo = dados.split(".")[0]
    const user_alvo = dados.split(".")[1]

    const role = await getTimedRoleAssigner(user_alvo, interaction.guild.id)
    role.rid = id_cargo

    await role.save()

    dados = {
        id: user_alvo,
        rid: id_cargo
    }

    // Redirecionando o evento
    require('../../chunks/role_timed_assigner')({ client, user, interaction, dados })
}