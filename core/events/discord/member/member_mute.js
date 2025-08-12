module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user, timeout = registroAudita?.changes[0] ? parseInt(new Date(registroAudita?.changes[0].new) - new Date()) : null
    let razao = "", network_descricao = "", canal_aviso = guild.logger.channel

    // Timeout ou usuário inválido
    if (timeout < 0 || user_alvo.id !== registroAudita.targetId) return

    // Alterando o canal alvo conforme o filtro de eventos do death note
    if (guild.death_note.note && guild.death_note.member_punishment && guild.death_note.channel)
        canal_aviso = guild.death_note.channel

    if (registroAudita.reason) { // Castigo com motivo explicado
        razao = `\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_castigo")}:\n${registroAudita.reason}`

        // Ação realizada através do network
        if (registroAudita.reason.includes("Network | ") && registroAudita.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    let embed = client.create_embed({
        title: { tls: timeout ? "mode.logger.membro_castigado_titulo" : "mode.logger.membro_perdoado_titulo" },
        color: timeout ? "salmao" : "branco",
        description: `${timeout ? `**${client.tls.phrase(guild, "mode.logger.membro_castigado")}**` : `**${client.tls.phrase(guild, "mode.logger.membro_perdoado")}**`}${razao}`,
        fields: [
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: client.user_title(registroAudita.executor, guild, "mode.logger.autor", client.defaultEmoji("guard")),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    if (timeout) { // Exibindo o tempo de castigo que o membro recebeu

        let tempo_timeout = parseInt(timeout / 1000) + 1

        if (tempo_timeout > 86400)
            formatado = `${parseInt((((tempo_timeout / 24) / 60) / 60))} dias`
        else if (tempo_timeout > 3600)
            formatado = `${parseInt((tempo_timeout / 60) / 60)} horas`
        else if (tempo_timeout > 60)
            formatado = `${parseInt(tempo_timeout / 60)} minutos`
        else formatado = `${tempo_timeout} segundos`

        embed.addFields(
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "mode.logger.tempo_castigo")}**`,
                value: `**${client.tls.phrase(guild, "mode.warn.remocao_em")} \`${formatado}\`**\n( <t:${parseInt(client.timestamp() + (timeout / 1000))}:f> )`,
                inline: false
            }
        )
    } else {

        const user_guild = await client.getMemberGuild(guild.sid, user_alvo.id)

        // Data de entrada do membro no servidor
        embed = client.execute("formatters", "formata_entrada_membro", { client, guild, user_guild, embed })
    }

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    const obj = {
        embeds: [embed]
    }

    // Notificações do Death note
    if (guild.death_note.channel === canal_aviso && guild.death_note.notify)
        obj.content = "@here"

    client.notify(canal_aviso, obj)
}