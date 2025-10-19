const { AuditLogEvent, PermissionsBitField, ChannelType } = require('discord.js')

const { channelTypes } = require('../../../formatters/patterns/guild')
const { voiceChannelTimeout } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, channel }) => {

    const guild = await client.getGuild(channel.guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.channel_created || !guild.conf.logger) return

    // Permissão para ver o registro de auditoria, desabilitando o logger
    if (!await client.execute("permissions", { interaction: channel, id_user: client.id(), permissions: PermissionsBitField.Flags.ViewAuditLog })) {

        guild.logger.channel_created = false
        guild.save()

        return client.execute("notify", {
            id_canal: guild.logger.channel,
            conteudo: { content: client.tls.phrase(guild, "mode.logger.permissao", 7) }
        })
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

    // Canal criado a partir do módulo de canais de voz dinâmicos
    if (guild.conf.voice_channels && registroAudita.executorId === client.id())
        tipo_canal += `\n\n⚡ ${client.tls.phrase(guild, "mode.logger.canal_dinamico")}\n${client.defaultEmoji("time")} ${client.tls.phrase(guild, "mode.logger.canal_dinamico_remocao", null, voiceChannelTimeout[guild.voice_channels.timeout])}`

    const embed = client.create_embed({
        title: { tls: "mode.logger.canal_criado" },
        color: "turquesa",
        description: `${client.tls.phrase(guild, "mode.logger.canal_criado_desc", 43)}\n\`\`\`${tipo_canal}\`\`\``,
        fields: [
            {
                name: client.execute("user_title", { user: registroAudita.executor, scope: guild, tls: "mode.logger.autor", emoji: client.defaultEmoji("guard") }),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${registroAudita.target.type === ChannelType.GuildCategory ? client.tls.phrase(guild, "util.server.categoria") : client.tls.phrase(guild, "mode.canal.canal")}**`,
                value: `${client.emoji("icon_id")} \`${channel.id}\`\n${registroAudita.target.type !== 4 ? `:placard: \`${channel.name}\`\n( <#${channel.id}> )` : `\`${channel.name}\``}`,
                inline: true
            }
        ],
        timestamp: true,
    }, guild)

    // Canais que não são categorias
    if (registroAudita.target.type !== 4)
        embed.addFields(
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(guild, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${channel.parentId || client.tls.phrase(guild, "mode.logger.sem_categoria")}\`\n( ${channel.parentId ? `<#${channel.parentId}>` : `\`❌ ${client.tls.phrase(guild, "mode.logger.sem_categoria")}\``} )`,
                inline: true
            }
        )

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}