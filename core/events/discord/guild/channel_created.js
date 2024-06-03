const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { channelTypes } = require('../../../formatters/patterns/guild')

module.exports = async ({ client, channel }) => {

    const guild = await client.getGuild(channel.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.channel_created || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.permissions(channel, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        guild.logger.channel_created = false
        guild.save()

        return client.notify(guild.logger.channel, { content: client.tls.phrase(guild, "mode.logger.permissao", 7) })
    }

    // Coletando dados sobre o evento
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelCreate,
        limit: 1
    })

    const registroAudita = fetchedLogs.entries.first()
    let tipo_canal

    if (channelTypes[registroAudita.target.type]) tipo_canal = `${channelTypes[registroAudita.target.type]} ${client.tls.phrase(guild, `menu.channels.${registroAudita.target.type}`)}`
    else tipo_canal = `❔ ${client.tls.phrase(guild, "mode.logger.canal_tipo_desconhecido")}`

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.canal_criado"))
        .setColor(0x29BB8E)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.canal_criado_desc", 43)}\n\`\`\`${tipo_canal}\`\`\``)
        .setFields(
            {
                name: client.user_title(registroAudita.executor, guild, "mode.logger.autor", client.defaultEmoji("guard")),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${registroAudita.target.type === 4 ? "Categoria" : client.tls.phrase(guild, "mode.canal.canal")}**`,
                value: `${client.emoji("icon_id")} \`${channel.id}\`\n${registroAudita.target.type !== 4 ? `:placard: \`${channel.name}\`\n( <#${channel.id}> )` : `\`${channel.name}\``}`,
                inline: true
            }
        )
        .setTimestamp()

    // Canais que não são categorias
    if (registroAudita.target.type !== 4)
        embed.addFields(
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(guild, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${channel.parentId || client.tls.phrase(guild, "mode.logger.sem_categoria")}\`\n( ${channel.parentId ? `<#${channel.parentId}>` : client.tls.phrase(guild, "mode.logger.sem_categoria")} )`,
                inline: true
            }
        )

    client.notify(guild.logger.channel, { embeds: [embed] })
}