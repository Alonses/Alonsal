const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { dropUserGuild } = require('../../../database/schemas/User_guilds.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)
    const user = await client.getUser(dados.user.id)

    // Removendo o servidor salvo em cache do usuário
    if (user.conf?.cached_guilds) dropUserGuild(user.uid, dados.guild.id)

    if (guild.conf.nuke_invites && guild.nuke_invites.type) // Buscando pelos convites do usuário que saiu do servidor
        client.checkUserInvites(guild, dados.user.id)

    // Verificando se a guild habilitou o logger
    if (!guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(dados, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.member_left = false
        guild.logger.member_kick = false
        guild.logger.member_ban_add = false
        guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Verificando se o usuário foi expulso do servidor
    const fetchedLogs2 = await dados.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 1
    })

    const registroAudita2 = fetchedLogs2.entries.first()
    const user_alvo = dados.user

    if (registroAudita2)
        if (registroAudita2.targetId === user_alvo.id) // Membro foi expulso do servidor
            return require('./member_kick.js')({ client, guild, user_alvo, registroAudita2 })

    // Verificando se o usuário foi banido
    const fetchedLogs = await dados.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()

    if (registroAudita)
        if (registroAudita.targetId === user_alvo.id || !guild.logger.member_left)
            return // Usuário foi banido ou recurso desativado

    let embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_saiu"))
        .setColor(client.embed_color("salmao"))
        .setFields(
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()

    // Data de entrada do membro no servidor
    const user_guild = dados
    embed = client.execute("formatters", "formata_entrada_membro", { client, guild, user_guild, embed })

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}