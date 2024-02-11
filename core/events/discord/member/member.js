const { PermissionsBitField, AuditLogEvent } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados[0].guild.id)
    const user_alvo = dados[0].user

    if (guild.network.member_punishment && guild.conf.network) // Network de servidores
        client.network(guild, "mute", user_alvo.id)

    // Verificando se a guild habilitou o logger
    if (!guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(dados[0], client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.member_role = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here\n${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Verificando qual atributo foi atualizado
    const guild_evento = await client.guilds(guild.sid)
    const fetchedLogs = await guild_evento.fetchAuditLogs({
        type: AuditLogEvent.MemberUpdate,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()

    // Apelido alterado
    if (dados[0].nickname !== dados[1].nickname && dados[0].nickname && guild.logger.member_nick)
        return require('./member_nick')({ client, guild, registroAudita, dados })

    // Membro foi mutado
    if (dados[0].communicationDisabledUntilTimestamp !== dados[1].communicationDisabledUntilTimestamp && guild.logger.member_punishment)
        return require('./member_mute')({ client, guild, registroAudita, dados })

    // Membro teve os cargos atualizados
    if (dados[0]._roles !== dados[1]._roles && dados[0]._roles.length > 0 && guild.logger.member_role)
        return require('./member_role')({ client, guild, dados })

    const user = await client.getUser(user_alvo.id)

    // Membro atualizou a foto de perfil
    if (user.profile.avatar !== dados[1].user.avatarURL({ dynamic: true }) && guild.logger.member_image)
        return require('./member_avatar')({ client, guild, user, dados })
}