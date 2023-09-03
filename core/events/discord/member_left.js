const { EmbedBuilder } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0) || !client.x.logger) return

    const user_alvo = dados.user

    const embed = new EmbedBuilder()
        .setTitle("> Um membro saiu!")
        .setColor(0xED4245)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **Membro**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **Entrada original**`,
                value: `<t:${parseInt(dados.joinedTimestamp / 1000)}:F> )`,
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
                name: `:robot: **É um Bot!**`,
                value: "⠀",
                inline: true
            }
        )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, embed)
}