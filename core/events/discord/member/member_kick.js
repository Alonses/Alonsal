const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, user_alvo, registroAudita2 }) => {

    if (guild.network.member_kick && guild.conf.network) // Network de servidores
        client.network(guild, "kick", user_alvo.id)

    if (guild.conf.nuke_invites) // Buscando pelos convites do usuário removido
        client.checkUserInvites(guild, user_alvo.id)

    // Verificando se o recurso está ativo
    if (!guild.logger.member_kick || !guild.conf.logger)
        return

    let razao = ""

    if (registroAudita2.reason) // Banimento com motivo explicado
        razao = `\n\`\`\`fix\n💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_expulsao")}: ${registroAudita2.reason}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_expulso"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.membro_expulso_desc", client.emoji("mc_writable_book"))}${razao}`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita2.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.executor.username}\`\n( <@${registroAudita2.executorId}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita2.targetId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.target.username}\`\n( <@${registroAudita2.targetId}> )`,
                inline: true
            }
        )
        .setTimestamp()

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