const { EmbedBuilder, AuditLogEvent } = require('discord.js')

module.exports = async ({ client, guild, dados }) => {

    const user_alvo = dados[0].user
    let texto = "", removidos = [], adicionados = []
    let old_member = dados[0], new_member = dados[1]

    // Coletando dados sobre o evento
    const fetchedLogs = await dados[0].guild.fetchAuditLogs({
        type: AuditLogEvent.MemberRoleUpdate,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()

    if (old_member.roles.cache.size > new_member.roles.cache.size)
        old_member.roles.cache.forEach(role => {
            if (!new_member.roles.cache.has(role.id))
                removidos.push(`<@&${role.id}>`)
        })
    else
        new_member.roles.cache.forEach(role => {
            if (!old_member.roles.cache.has(role.id))
                adicionados.push(`<@&${role.id}>`)
        })

    if (adicionados.length > 0)
        texto += `\n**:sparkle: ${client.tls.phrase(guild, "mode.logger.cargo_adicionado")}:** ${adicionados.join(", ")}`

    if (removidos.length > 0)
        texto += `\n**:no_entry_sign: ${client.tls.phrase(guild, "mode.logger.cargo_removido")}:** ${removidos.join(", ")}`

    // Membros não salvos no cache
    if (adicionados.length > 1 || removidos.length > 1 || old_member.roles.cache.size == 0 || texto.length < 1)
        return

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.cargo_atualizado"))
        .setColor(0x29BB8E)
        .setDescription(texto)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
                value: `<t:${parseInt(new_member.joinedTimestamp / 1000)}:F> ( <t:${Math.floor(new_member.joinedTimestamp / 1000)}:R> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.logger.alterador")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executor.id}\`\n( <@${registroAudita.executor.id}> )`,
                inline: false
            }
        )
        .setTimestamp()
        .setFooter({
            text: user_alvo.username
        })

    // Usuário é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    // Listando todas as permissões do usuário
    embed.addFields(
        {
            name: `**:shield: ${client.tls.phrase(guild, "mode.logger.permissoes_apos")}**`,
            value: client.list(new_member.permissions.toArray(), 2000),
            inline: false
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, embed)
}