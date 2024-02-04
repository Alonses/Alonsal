const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user
    const timeout = registroAudita.changes[0].new ? parseInt(new Date(registroAudita.changes[0].new) - new Date()) : null
    const member_guild = await client.getMemberGuild(guild.sid, user_alvo.id)

    const embed = new EmbedBuilder()
        .setTitle(timeout ? "🔇 Membro castigado" : "🔊 Remoção de castigo")
        .setColor(timeout ? 0xED4245 : 0xffffff)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (timeout) // Exibindo o tempo de castigo do usuário
        embed.addFields(
            {
                name: `${client.defaultEmoji("time")} **Tempo de castigo**`,
                value: `<t:${parseInt(client.timestamp() + (timeout / 1000))}:F> )`,
                inline: true
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

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}