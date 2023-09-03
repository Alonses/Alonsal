const { PermissionsBitField } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados[0].guild.id)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0) || !client.x.logger) return

    // Permissão para ver o registro de auditoria
    const bot = await client.getMemberGuild(dados[0], client.id())
    if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog))
        return client.notify(guild.logger.channel, `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}`)

    // Alterando os cargos do usuário
    if (dados[0]._roles !== dados[1]._roles && dados[0]._roles.length > 0)
        return require('./endpoints/member_role')({ client, guild, dados })

    const user = await client.getUser(dados[0].user.id)

    // Usuário atualizou a foto de perfil
    if (user.profile.avatar !== dados[1].user.avatarURL({ dynamic: true }))
        return require('./endpoints/member_avatar')({ client, guild, user, dados })
}