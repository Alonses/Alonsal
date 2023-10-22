const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, cached_guild, guild_evento, registroAudita, bot_member }) => {

    // Verificando se o do bot tem as permissões necessárias para desbanir membros
    if (!bot_member.permissions.has([PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers]))
        return

    const descricao_evento = client.replace(client.tls.phrase(user, "mode.network.ban_removido"), [registroAudita.executor.username, guild_evento.name])

    // Removendo o banimento do usuário do servidor
    await cached_guild.members.unban(registroAudita.targetId, { reason: descricao_evento })
        .catch(console.error)
}