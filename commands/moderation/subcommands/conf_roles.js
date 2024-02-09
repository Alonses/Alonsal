const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    // Permissão para atualizar os cargos de membros do servidor
    const permissoes = await client.permissions(interaction, client.id(), PermissionsBitField.Flags.ManageRoles)
    if (!permissoes)
        return interaction.reply({
            content: ":passport_control: | Eu não possuo permissões para `gerenciar cargos` no servidor,\né necessário conceder essa permissão para que eu possa atribuir cargos para os usuários de forma automática.",
            ephemeral: true
        })

    return require('../../../core/interactions/chunks/role_assigner.js')({ client, user, interaction })
}