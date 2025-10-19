module.exports = async ({ client, guild, user_alvo, registroAudita2 }) => {

    if (guild.network.member_kick && guild.conf.network) // Network de servidores
        client.network(guild, "kick", user_alvo.id)

    if (guild.conf.nuke_invites && !guild.nuke_invites.type) // Buscando pelos convites do usuário expulso
        client.execute("checkUserInvites", { guild, id_user: user_alvo.id })

    // Verificando se o recurso está ativo
    if (!guild.logger.member_kick || !guild.conf.logger) return

    let razao = "", network_descricao = "", canal_aviso = guild.logger.channel

    // Alterando o canal alvo conforme o filtro de eventos do death note
    if (guild.death_note.note && guild.death_note.member_kick && guild.death_note.channel)
        canal_aviso = guild.death_note.channel

    if (registroAudita2.reason) { // Banimento com motivo explicado
        razao = `💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_expulsao")}: ${registroAudita2.reason}`

        // Ação realizada através do network
        if (registroAudita2.reason.includes("Network | ") && registroAudita2.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita2.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    const embed = client.create_embed({
        title: { tls: "mode.logger.membro_expulso" },
        color: "salmao",
        description: `${client.tls.phrase(guild, "mode.logger.membro_expulso_desc", client.emoji("mc_writable_book"))}${razao}`,
        fields: [
            {
                name: client.execute("user_title", { user: user_alvo, scope: guild, tls: "util.server.membro" }),
                value: `${client.emoji("icon_id")} \`${registroAudita2.targetId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.target.username}\`\n( <@${registroAudita2.targetId}> )`,
                inline: true
            },
            {
                name: client.execute("user_title", { user: registroAudita2.executor, scope: guild, tls: "mode.logger.autor", emoji: client.defaultEmoji("guard") }),
                value: `${client.emoji("icon_id")} \`${registroAudita2.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.executor.username}\`\n( <@${registroAudita2.executorId}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    const obj = {
        embeds: [embed]
    }

    // Notificações do Death note
    if (guild.death_note.channel === canal_aviso && guild.death_note.notify)
        obj.content = "@here"

    client.execute("notify", { id_canal: canal_aviso, conteudo: obj })
}