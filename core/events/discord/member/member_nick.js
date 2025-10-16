module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user

    // Usuário inválido
    if (user_alvo.id !== registroAudita.targetId) return

    let moderador = false, descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado")

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user_alvo.id && registroAudita.changes[0].key === "nick") {
        descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado_moderador")
        moderador = true
    }

    const embed = client.create_embed({
        title: { tls: "mode.logger.apelido_atualizado_titulo" },
        color: "turquesa",
        description: `${client.emoji("mc_name_tag")} | ${descricao}`,
        fields: [
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user_alvo.id && registroAudita.changes[0].key === "nick")
        embed.addFields(
            {
                name: client.user_title(registroAudita.executor, guild, "mode.logger.alterador", client.defaultEmoji("guard")),
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )

    embed.addFields(
        {
            name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(guild, "mode.logger.apelido")}**`,
            value: `${client.emoji(43)} **${client.tls.phrase(guild, "mode.logger.apelido_novo")}:** \`${registroAudita.changes[0].new || user_alvo.username}\`\n${client.emoji(55)} **${client.tls.phrase(guild, "mode.logger.apelido_antigo")}:** \`${registroAudita.changes[0].old || user_alvo.username}\``,
            inline: !moderador
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}