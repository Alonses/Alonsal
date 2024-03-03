const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { channelTypes } = require('../../../database/schemas/Guild')

module.exports = async ({ client, channel }) => {

    const guild = await client.getGuild(channel.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.channel_delete || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(channel, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.channel_delete = false
        await guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()
    let tipo_canal

    if (channelTypes[registroAudita.target.type])
        tipo_canal = `${channelTypes[registroAudita.target.type]} ${client.tls.phrase(guild, `menu.channels.${registroAudita.target.type}`)}`
    else
        tipo_canal = `❔ ${client.tls.phrase(guild, "mode.logger.canal_tipo_desconhecido")}`

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.titulo_canal_excluido"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.canal_excluido_desc", 13)}\n\`\`\`${tipo_canal}\`\`\``)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "mode.canal.canal")}**`,
                value: `${client.emoji("icon_id")} \`${channel.id}\`\n( \`${channel.name}\` )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(guild, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${channel.parentId || client.tls.phrase(guild, "mode.logger.sem_categoria")}\`\n( ${channel.parentId ? `<#${channel.parentId}>` : client.tls.phrase(guild, "mode.logger.sem_categoria")} )`,
                inline: true
            }
        )
        .setTimestamp()

    client.notify(guild.logger.channel, { embeds: [embed] })
}