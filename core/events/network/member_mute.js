const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, id_alvo, guild_member, guild_executor, bot_member }) => {

    // Confirmando se a alteração foi para mutar o membro
    if (registroAudita.changes[0].key === "communication_disabled_until" && registroAudita.targetId === id_alvo) {
        // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode castigar membros
        if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.ModerateMembers]))
            return

        // Verificando se a hierarquia do bot é maior que o do alvo e se pode castigar membros
        if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.ModerateMembers]))
            return

        const timeout = registroAudita.changes[0].new ? parseInt(new Date(registroAudita.changes[0].new) - new Date()) : null

        await guild_member.timeout(timeout, `Castigado por ${registroAudita.executor.username} em ${guild_evento.name}${registroAudita.reason ? `, Motivo: ${registroAudita.reason}` : ""}`)
            .catch(console.error)
    }
}