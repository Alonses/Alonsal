const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, id_alvo, guild_member, guild_executor, bot_member }) => {

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode expulsar membros
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.KickMembers]))
        return

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode expulsar membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.KickMembers]))
        return

    await guild_member.kick(`Expulso por ${registroAudita.executor.username} em ${guild_evento.name}${registroAudita.reason ? `, Motivo: ${registroAudita.reason}` : ""}`)
        .catch(console.error)
}