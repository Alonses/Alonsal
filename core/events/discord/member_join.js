const { EmbedBuilder } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0) || !client.x.logger) return

    const user_alvo = dados.user

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.novo_membro"))
        .setColor(0x29BB8E)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: user_alvo.username
        })

    // User é um BOT
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

    client.notify(guild.logger.channel, embed)
}