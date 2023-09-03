const { EmbedBuilder } = require('discord.js')

module.exports = async (client, dados) => {

    const user_alvo = dados[0].user

    const embed = new EmbedBuilder()
        .setTitle("> Avatar atualizado")
        .setColor(0x29BB8E)
        .setDescription(":frame_photo: | O novo avatar do usuário é este!")
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **Membro**`,
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