const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user
    const member_guild = await client.getMemberGuild(guild.sid, user_alvo.id)

    let moderador = false, descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado")

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user_alvo.id && registroAudita.changes[0].key === "nick") {
        descricao = client.tls.phrase(guild, "mode.logger.apelido_alterado_moderador")
        moderador = true
    }

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.apelido_atualizado"))
        .setColor(0x29BB8E)
        .setDescription(`${client.emoji("mc_name_tag")} | **${descricao}**`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()

    // Exibindo o moderador que fez a alteração de nick
    if (registroAudita.executorId !== user_alvo.id && registroAudita.changes[0].key === "nick")
        embed.addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.logger.alterador")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )

    embed.addFields(
        {
            name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(guild, "mode.logger.apelido")}**`,
            value: `${client.emoji(43)} **${client.tls.phrase(guild, "mode.logger.apelido_novo")}:** \`${registroAudita.changes[0].new || user_alvo.username}\`\n${client.emoji(55)} **${client.tls.phrase(guild, "mode.logger.apelido_antigo")}:** \`${registroAudita.changes[0].old}\``,
            inline: !moderador
        }
    )

    // Usuário é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    embed.addFields(
        {
            name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
            value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>\n( <t:${Math.floor(member_guild.joinedTimestamp / 1000)}:R> )`,
            inline: false
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}