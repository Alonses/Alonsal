const { EmbedBuilder } = require('discord.js')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    const user_alvo = dados.user

    const embed = new EmbedBuilder()
        .setTitle("> Um membro saiu!")
        .setColor(0xED4245)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **Membro**`,
                value: `**:label: ID:** \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **Entrada original**`,
                value: `<t:${parseInt(dados.joinedTimestamp / 1000)}:F> )`,
                inline: true
            }
        )
        .setFooter({ text: user_alvo.username })
        .setTimestamp()

    // User é um BOT
    if (user_alvo.bot)
        embed.setFields(
            {
                name: `:robot: **É um bot**`,
                value: "⠀",
                inline: true
            }
        )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, embed)
}