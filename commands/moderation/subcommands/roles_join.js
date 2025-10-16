const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    // Permissão para atualizar os cargos de membros do servidor
    if (!await client.execute("permissions", { interaction, id_user: client.id(), permissions: PermissionsBitField.Flags.ManageRoles }))
        return client.tls.reply(interaction, user, "mode.roles.sem_permissao", true, 7)

    const caso = "join"
    return require('../../../core/interactions/chunks/role_assigner.js')({ client, user, interaction, caso })
}