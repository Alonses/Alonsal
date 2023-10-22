const { PermissionsBitField } = require('discord.js')

module.exports = async ({ cached_guild, guild_evento, registroAudita, bot_member }) => {

    // Verificando se o do bot tem as permissões necessárias para desbanir membros
    if (!bot_member.permissions.has([PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers]))
        return

    // Removendo o banimento do usuário do servidor
    await cached_guild.members.unban(registroAudita.targetId, { reason: `Ban retirado por ${registroAudita.executor.username} em ${guild_evento.name}` })
        .catch(console.error)
}