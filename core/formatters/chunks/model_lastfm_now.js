const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, user, interaction, user_command }) => {

    let texto_entrada = ""

    const params = {
        url: interaction.options.getString("url"),
        user: interaction.options.getUser("user")
    }

    if (params.url) texto_entrada = params.url

    const id_user = interaction.options.getUser("user")?.id || interaction.user.id
    const user_alvo = await client.execute("getUser", { id_user })

    // user_alvo -> usuário marcado pelo comando
    // user -> usuário que disparou o comando

    if (!texto_entrada) // Verificando se o usuário possui link com a steam
        if (!user_alvo.social || !user_alvo.social.lastfm)
            return client.tls.reply(interaction, user, "util.lastfm.sem_link", true, 1)
        else
            texto_entrada = client.decifer(user_alvo.social.lastfm)

    // Aumentando o tempo de duração da resposta
    await client.deferedReply(interaction, interaction.user.id === id_user ? user_command || null : "Ephemeral")

    fetch(`${process.env.url_apisal}/lastfm?profile=${texto_entrada}&now=true`)
        .then(response => response.json())
        .then(async res => {

            if (res.status === "401") // Usuário existe mas não possui scrobbles
                return client.tls.editReply(interaction, user, "util.lastfm.sem_scrobbles", client.decider(user?.conf.ghost_mode || user_command, 0), 1)

            if (res.status === "402") // Erro na busca pela lastfm
                return client.tls.editReply(interaction, user, "util.lastfm.error_2", true, 4)

            if (res.status === "404") // Usuário não existe
                return client.tls.editReply(interaction, user, "util.lastfm.error_1", client.decider(user?.conf.ghost_mode || user_command, 0), 1)

            if (!res.scrobble_atual.faixa) // Usuário não está ouvindo nada
                return client.tls.editReply(interaction, user, "util.lastfm.nao_esta_ouvindo", true, 45)

            let row = [{ name: "LastFM", value: `https://www.last.fm/pt/user/${texto_entrada}`, type: 4, emoji: "🌐" }]

            if (res.scrobble_atual.link) // Música atual possui um link para ouvir
                row.push({ name: { tls: "menu.botoes.ouvir_tambem" }, emoji: client.defaultEmoji("music"), value: res.scrobble_atual.link, type: 4 })

            // Card do que o usuário está ouvindo atualmente
            const embed = client.create_embed({
                title: `${res.nome} ${client.tls.phrase(user, "util.lastfm.ouvindo_agora_card")}`,
                image: res.scrobble_atual.cover,
                description: `\`\`\`fix\n🎶 ${client.tls.phrase(user, "util.lastfm.em_scrobble")}:\n${res.scrobble_atual.curtida} ${client.execute("formata_texto", { string: res.scrobble_atual.faixa })}\`\`\``
            }, user_alvo)

            client.reply(interaction, {
                embeds: [embed],
                components: [client.create_buttons(row, interaction, user)],
                flags: interaction.user.id === id_user ? user_command || null : "Ephemeral"
            }, true)
        })
        .catch(() => {
            return client.tls.editReply(interaction, user, "util.lastfm.error_2", true, 4)
        })
}