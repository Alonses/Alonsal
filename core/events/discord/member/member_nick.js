module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user = dados[0].user

    // Usuário inválido
    if (user.id !== registroAudita.targetId) return

    let moderador = false, descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado")

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user.id && registroAudita.changes[0].key === "nick") {
        descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado_moderador")
        moderador = true
    }

    const embed = client.create_embed({
        title: { tls: "mode.logger.apelido_atualizado_titulo" },
        color: "turquesa",
        description: `${client.emoji("mc_name_tag")} | ${descricao}`,
        fields: [
            {
                name: client.execute("user_title", { user, scope: guild, tls: "util.server.membro" }),
                value: `${client.emoji("icon_id")} \`${user.id}\`\n${client.emoji("mc_name_tag")} \`${user.username}\`\n( <@${user.id}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user.id && registroAudita.changes[0].key === "nick")
        embed.addFields(
            {
                name: client.execute("user_title", { user: registroAudita.executor, scope: guild, tls: "mode.logger.alterador", emoji: client.defaultEmoji("guard") }),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )

    embed.addFields(
        {
            name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(guild, "mode.logger.apelido")}**`,
            value: `${client.emoji(43)} **${client.tls.phrase(guild, "mode.logger.apelido_novo")}:** \`${registroAudita.changes[0].new || user.username}\`\n${client.emoji(55)} **${client.tls.phrase(guild, "mode.logger.apelido_antigo")}:** \`${registroAudita.changes[0].old || user.username}\``,
            inline: !moderador
        }
    )

    const url_avatar = user.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}