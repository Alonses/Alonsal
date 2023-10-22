const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, guild_member, guild_executor, bot_member }) => {

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode banir membros
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.BanMembers]))
        return

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.BanMembers]))
        return

    await guild_member.ban({ // Banindo o usuário do servidor automaticamente
        reason: `Banido por ${registroAudita.executor.username} em ${guild_evento.name}${registroAudita.reason ? `, Motivo: ${registroAudita.reason}` : ""}`,
        deleteMessageSeconds: 3 * 24 * 60 * 60 // 3 dias
    })
        .catch(console.error)
}