const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, data }) => {

    const interaction = data.interaction
    const ignore_role = data.ignore_role
    const permitir_mods = data?.allow_mods || null

    const roles = []
    const id_ignorar = ignore_role || null

    interaction.guild.roles.cache.forEach(role => {
        if (role.id !== interaction.guild.id && role.id !== id_ignorar && role.editable) { // Adiciona apenas cargos customizados

            // Não inclui cargos que possuem permissões moderativas a menos que solicitado
            if ((!role.permissions.has(PermissionsBitField.Flags.ManageMessages) && !role.permissions.has(PermissionsBitField.Flags.ModerateMembers) && !role.permissions.has(PermissionsBitField.Flags.Administrator)) || permitir_mods)
                roles.push({ id: role.id, name: role.name })
        }
    })

    // Ordenando alfabeticamente os cargos
    return roles.sort((a, b) => (client.normalizeString(a.name) > client.normalizeString(b.name)) ? 1 : ((client.normalizeString(b.name) > client.normalizeString(a.name)) ? -1 : 0))
}