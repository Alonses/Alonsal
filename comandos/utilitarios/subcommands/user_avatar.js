const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let user_alvo = interaction.options.getUser("user") || interaction.user
    const user_c = await client.getUser(user_alvo.id)

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (!url_avatar)
        return interaction.reply({ content: client.tls.phrase(user, "util.avatar.sem_avatar"), ephemeral: true })

    const embed = new EmbedBuilder()
        .setTitle(`> ${user_alvo.username}`)
        .setColor(client.embed_color(user_c.misc.embed))
        .setImage(url_avatar)
        .setDescription(client.replace(client.tls.phrase(user, "util.avatar.download_avatar"), url_avatar))

    interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}