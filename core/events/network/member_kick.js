const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, internal_guild, guild_evento, registroAudita, id_alvo, guild_member, guild_executor, bot_member }) => {

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode expulsar membros
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.KickMembers]))
        return

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode expulsar membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.KickMembers])) {

        // Desativando o recurso no servidor sem a permissão requerida
        if (!bot_member.permissions.has([PermissionsBitField.Flags.KickMembers])) {
            internal_guild.network.member_kick = false
            await internal_guild.save()
        }

        return
    }

    let descricao_evento = client.replace(client.tls.phrase(internal_guild, "mode.network.expulso_por"), [registroAudita.executor.username, guild_evento.name])

    if (registroAudita.reason) // Razão do banimento especificada
        descricao_evento = `${descricao_evento}${client.tls.phrase(internal_guild, "mode.network.motivo")} ${registroAudita.reason}`

    await guild_member.kick(descricao_evento)
        .catch(console.error)
}