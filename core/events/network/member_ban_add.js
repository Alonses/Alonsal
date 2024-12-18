const { PermissionsBitField } = require('discord.js')

const { banMessageEraser } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, guild_member, guild_executor, bot_member }) => {

    // Verificando se o membro e o executor estão no servidor
    if (!guild_member || !guild_executor) return

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode banir membros
    if (guild_executor.roles.highest.position <= guild_member.roles.highest.position || !guild_executor.permissions.has(PermissionsBitField.Flags.BanMembers)) return

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
    if (bot_member.roles.highest.position <= guild_member.roles.highest.position || !bot_member.permissions.has(PermissionsBitField.Flags.BanMembers)) {

        // Desativando o recurso no servidor sem a permissão requerida
        if (!bot_member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            internal_guild.network.member_ban_add = false
            await internal_guild.save()
        }

        return
    }

    let descricao_evento = client.tls.phrase(internal_guild, "mode.network.banido_por", null, [registroAudita.executor.username, guild_evento.name])

    if (registroAudita.reason) // Razão do banimento especificada
        descricao_evento = `${descricao_evento}${client.tls.phrase(internal_guild, "mode.network.motivo")} ${registroAudita.reason}`

    // Atualiza o tempo de inatividade do servidor
    client.updateGuildIddleTimestamp(internal_guild.sid)

    await guild_member.ban({ // Banindo o usuário do servidor automaticamente
        reason: `📡 Network | ${descricao_evento}`,
        deleteMessageSeconds: banMessageEraser[internal_guild.network.erase_ban_messages]
    }).catch(console.error)
}