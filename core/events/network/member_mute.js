const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, id_alvo, guild_member, guild_executor, bot_member }) => {

    // Verificando se o membro e o executor estão no servidor
    if (!guild_member || !guild_executor) return

    // Confirmando se a alteração foi para mutar o membro e se é o membro correto
    if (registroAudita.changes[0].key !== "communication_disabled_until" || registroAudita.targetId !== id_alvo) return

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode castigar membros
    if (guild_executor.roles.highest.position <= guild_member.roles.highest.position || !guild_executor.permissions.has(PermissionsBitField.Flags.MuteMembers)) return

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode castigar membros
    if (bot_member.roles.highest.position <= guild_member.roles.highest.position || !bot_member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {

        // Desativando o recurso no servidor sem a permissão requerida
        if (!bot_member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            internal_guild.network.member_punishment = false
            await internal_guild.save()
        }

        return
    }

    const timeout = registroAudita.changes[0].new ? parseInt(new Date(registroAudita.changes[0].new) - new Date()) : null
    let descricao_evento = client.tls.phrase(internal_guild, "mode.network.castigado_por", null, [registroAudita.executor.username, guild_evento.name])

    if (registroAudita.reason) // Razão do banimento especificada
        descricao_evento = `${descricao_evento}${client.tls.phrase(internal_guild, "mode.network.motivo")} ${registroAudita.reason}`

    // Atualiza o tempo de inatividade do servidor
    client.updateGuildIddleTimestamp(internal_guild.sid)

    await guild_member.timeout(timeout, `📡 Network | ${descricao_evento}`)
        .catch(console.error)
}