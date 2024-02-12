const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, cached_guild, guild_evento, guild_executor, registroAudita, bot_member }) => {

    // Moderador não está no servidor
    if (!guild_executor) return

    // Verificando se o do bot tem as permissões necessárias para desbanir membros
    if (!bot_member.permissions.has([PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers])) {

        internal_guild.network.member_ban_add = false
        await internal_guild.save()

        return
    }

    const descricao_evento = client.replace(client.tls.phrase(internal_guild, "mode.network.ban_removido"), [registroAudita.executor.username, guild_evento.name])

    // Removendo o banimento do usuário do servidor
    await cached_guild.members.unban(registroAudita.targetId, { reason: `Network | ${descricao_evento}` })
        .catch(console.error)
}