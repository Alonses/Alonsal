module.exports = async ({ client, data }) => {

    const { interaction, id_role, permissions } = data

    const cached_role = client.getGuildRole(interaction, id_role)

    // Verificando se o cargo informado possui as permissões solicitadas
    for (let i = 0; i < permissions.length; i++)
        if (cached_role.permissions.has(permissions[i])) return false

    // Cargo everyone ou cargo proprietário do discord selecionado
    if (cached_role.id === interaction.guild.id || !cached_role.editable) return false

    return true
}