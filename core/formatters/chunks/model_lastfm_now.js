const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let texto_entrada = "", descricao = "", descricao_status = ""

    const params = {
        url: interaction.options.getString("url"),
        user: interaction.options.getUser("user")
    }

    if (params.url)
        texto_entrada = params.url

    alvo = interaction.options.getUser("user") || interaction.user
    const user_alvo = await client.getUser(alvo.id)

    // user_alvo -> usuário marcado pelo comando
    // user -> usuário que disparou o comando

    if (!texto_entrada) // Verificando se o usuário possui link com a steam
        if (!user_alvo.social || !user_alvo.social.lastfm)
            return client.tls.reply(interaction, user, "util.lastfm.sem_link", true, 1)
        else
            texto_entrada = user_alvo.social.lastfm

    // Aumentando o tempo de duração da resposta
    await interaction.deferReply({ ephemeral: client.decider(user?.conf.ghost_mode, 0) })

    fetch(`${process.env.url_apisal}/lastfm?profile=${texto_entrada}`)
        .then(response => response.json())
        .then(async res => {

            if (res.status === "401") // Usuário existe mas não possui scrobbles
                return client.tls.editReply(interaction, user, "util.lastfm.sem_scrobbles", client.decider(user?.conf.ghost_mode, 0), 1)

            if (res.status === "402") // Erro na busca pela lastfm
                return client.tls.editReply(interaction, user, "util.lastfm.error_2", true, 4)

            if (res.status === "404") // Usuário não existe
                return client.tls.editReply(interaction, user, "util.lastfm.error_1", client.decider(user?.conf.ghost_mode, 0), 1)

            let row = [{ name: "LastFM", value: `https://www.last.fm/pt/user/${texto_entrada}`, type: 4, emoji: "🌐" }]

            if (res.scrobble_atual.link) // Música atual possui um link para ouvir
                row.push({ name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: res.scrobble_atual.link, type: 4 })

            if (res.descricao) // Usuário com descrição no perfil
                descricao = res.descricao

            if (res.scrobble_atual) // Usuário está ouvindo agora atualmente
                descricao_status += `🎶 ${client.tls.phrase(user, "util.lastfm.em_scrobble")}:\n${res.scrobble_atual.curtida} ${res.scrobble_atual.faixa}`

            if (descricao_status.length > 0)
                descricao_status = `\`\`\`fix\n${descricao_status}\`\`\``

            const embed = new EmbedBuilder()
                .setTitle(`${res.nome} está scroblando agora!`)
                .setColor(client.embed_color(user_alvo.misc.color))
                .setImage(res.scrobble_atual.cover)
                .setDescription(`${descricao}${descricao_status}`)

            interaction.editReply({
                embeds: [embed],
                components: [client.create_buttons(row, interaction)],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        })
}