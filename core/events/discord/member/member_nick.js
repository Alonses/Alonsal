const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user
    let moderador = false, descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado")

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user_alvo.id && registroAudita.changes[0].key === "nick") {
        descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado_moderador")
        moderador = true
    }

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.apelido_atualizado_titulo"))
        .setColor(0x29BB8E)
        .setDescription(`${client.emoji("mc_name_tag")} | **${descricao}**`)
        .setFields(
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()

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

    client.notify(guild.logger.channel, { embeds: [embed] })
}