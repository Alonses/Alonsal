const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, user, interaction }) => {

    let user_alvo = interaction.options.getUser("user") || interaction.user
    const user_c = await client.getUser(user_alvo.id)

    let response = fetch(`https://discord.com/api/v8/users/${user_alvo.id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bot ${client.x.token}`
        }
    })

    let receive = "", url_banner = ""

    response.then(a => {
        if (a.status !== 404) {
            a.json().then(data => {
                receive = data["banner"]

                if (receive !== null) {

                    let format = "png"
                    if (receive.substring(0, 2) === "a_") {
                        format = "gif"
                    }

                    url_banner = `https://cdn.discordapp.com/banners/${user_alvo.id}/${receive}.${format}?size=2048`
                }

                // Usuário sem banner customizado
                if (url_banner.length < 1)
                    return client.tls.reply(interaction, user, "util.avatar.sem_banner", true, client.emoji(0))

                const row = client.create_buttons([
                    { name: { tls: "menu.botoes.navegador", alvo: user }, type: 4, emoji: "🌐", value: url_banner }
                ])

                // Exibindo o banner do usuário
                const embed = client.create_embed({
                    title: `> ${user_alvo.username}`,
                    color: user_c.misc.embed,
                    image: url_banner,
                    description: { tls: "util.avatar.download_banner" }
                }, user)

                client.reply(interaction, {
                    embeds: [embed],
                    components: [row],
                    flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
                })
            })
        }
    })
}