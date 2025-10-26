const { AuditLogEvent, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, oldState, newState }) => {

    // Verificando se o autor da mensagem editada é o bot ou se o bot está ignorando a guild principal
    if ((oldState.member.user.bot || newState.member.user.bot) || (oldState.guild.id === process.env.guild_id && client.x.guild_timeout)) return

    const guild = await client.getGuild(oldState.guild.id)

    // Canais de voz dinâmicos ativos no servidor e ligados no bot
    if (guild.conf.voice_channels && client.x.voice_channels) require("../member/member_voice_channel")({ client, guild, oldState, newState })

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_voice_status || !guild.conf.logger) return

    let frase

    // Coletando dados do canal de voz que ocorreu o evento para exibição
    const guild_channel = await client.getGuildChannel(oldState?.channelId || newState?.channelId), fields = []

    if (newState.channelId === null) frase = client.tls.phrase(guild, "mode.logger.canal_saida", [48, 30], [oldState.id, oldState.channelId])
    else if (oldState.channelId === null) frase = client.tls.phrase(guild, "mode.logger.canal_entrada", [48, 50], [oldState.id, newState.channelId])
    else if (oldState.channelId !== newState.channelId) {

        // Troca entre canais de voz no servidor
        const canal_antigo = await client.getGuildChannel(oldState.channelId)
        const canal_novo = await client.getGuildChannel(newState.channelId)

        frase = client.tls.phrase(guild, "mode.logger.canal_troca", [48, 49], [oldState.id, oldState.channelId, newState.channelId])

        // Verificando permissões para acessar o registro de auditória
        if (await client.execute("permissions", { message: newState, id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewAuditLog] })) {

            // Coletando dados sobre o evento
            const fetchedLogs = await oldState.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberMove,
                limit: 1
            })

            const registroAudita = fetchedLogs.entries.first()
            frase = client.tls.phrase(guild, "mode.logger.canal_movido", [48, 49], [registroAudita.executorId, oldState.id, oldState.channelId, newState.channelId])

            fields.push({
                name: client.execute("user_title", { user: registroAudita.executor, scope: guild, tls: "mode.logger.autor", emoji: client.defaultEmoji("guard") }),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            })
        }

        fields.push(
            {
                name: `${client.emoji(30)} ${client.tls.phrase(guild, "mode.logger.canal_antigo")}`,
                value: `${client.emoji("icon_id")} \`${oldState.channelId}\`\n${`:placard: \`${canal_antigo.name}\`\n( <#${oldState.channelId}> )`}`,
                inline: true
            },
            {
                name: `${client.emoji(43)} ${client.tls.phrase(guild, "mode.logger.canal_novo")}`,
                value: `${client.emoji("icon_id")} \`${newState.channelId}\`\n${`:placard: \`${canal_novo.name}\`\n( <#${newState.channelId}> )`}`,
                inline: true
            }
        )
    }

    // Entrada e saída de canal
    if (!newState.channelId || !oldState.channelId)
        fields.push({
            name: `${client.emoji(43)} ${client.tls.phrase(guild, newState?.channelId ? "mode.logger.canal_antigo" : "mode.logger.canal_novo" )}`,
            value: `${client.emoji("icon_id")} \`${guild_channel.id}\`\n${`:placard: \`${guild_channel.name}\`\n( <#${guild_channel.id}> )`}`,
            inline: true
        })

    const embed = client.create_embed({
        title: { tls: "mode.logger.canal_voz" },
        color: "pastel",
        fields,
        description: frase,
        timestamp: true,
        footer: {
            text: `${client.tls.phrase(guild, "mode.logger.id_membro")} ${oldState.id}`
        }
    }, guild)

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}