module.exports = async ({ client, user, interaction }) => {

    let user_alvo = interaction.options.getUser("user") || interaction.user
    const user_c = await client.getUser(user_alvo.id)

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (!url_avatar)
        return client.tls.reply(interaction, user, "util.avatar.sem_avatar", true, 1)

    const row = client.create_buttons([{ name: { tls: "menu.botoes.navegador", alvo: user }, type: 4, emoji: "🌐", value: url_avatar }])

    const embed = client.create_embed({
        title: `> ${user_alvo.username}`,
        color: user_c.misc.color,
        image: url_avatar,
        description: { tls: "util.avatar.download_avatar" }
    }, user)

    let ephemeral = "Ephemeral"

    // Caso seja o próprio usuário que esteja querendo ver sua foto de perfil
    if (user.uid === client.encrypt(user_alvo.id))
        ephemeral = client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null

    interaction.reply({
        embeds: [embed],
        components: [row],
        flags: ephemeral
    })
}