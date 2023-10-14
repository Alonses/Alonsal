const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')
const { channelTypes } = require('../../database/schemas/Guild')

module.exports = async ({ client, channel }) => {

    const guild = await client.getGuild(channel.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.channel_created || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    const bot = await client.getMemberGuild(channel, client.id())
    if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.channel_created = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelCreate,
        limit: 1,
    })

    const registroAudita = fetchedLogs.entries.first()

    const embed = new EmbedBuilder()
        .setTitle("> Canal criado")
        .setColor(0x29BB8E)
        .setDescription(`:new: | Um novo canal foi criado!\n\`\`\`${channelTypes[registroAudita.target.type].join(" ") || "❔ Tipo de canal desconhecido"}\`\`\``)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "mode.canal.canal")}**`,
                value: `${client.emoji("icon_id")} \`${channel.id}\`\n( \`${channel.name}\` )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(guild, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${channel.parentId || 'Não definido'}\`\n( ${channel.parentId ? `<#${channel.parentId}>` : 'Não definido'} )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: registroAudita.executor.username
        })

    client.notify(guild.logger.channel, { embeds: [embed] })
}