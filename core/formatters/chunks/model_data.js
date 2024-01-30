const { EmbedBuilder } = require('discord.js')

const { getUserRankServers } = require('../../database/schemas/Rank_s')
const { buildAllBadges } = require('../../data/badges')

const { emoji_button } = require('../../functions/emoji_button')
const { listAllUserGuilds } = require('../../database/schemas/User_guilds')

module.exports = async ({ client, user, interaction }) => {

    const ranking = [], guilds_ranking = await getUserRankServers(interaction.user.id)
    let nota_servidores = ""

    // Listando os servidores que o usuário possui ranking
    guilds_ranking.forEach(valor => {
        let server = client.guilds().get(valor.sid)

        if (!server) {
            nome_server = client.tls.phrase(user, "manu.data.server_desconhecido")
            nota_servidores = `\n\n${client.tls.phrase(user, "manu.data.nota_servidores", 1)}`
        } else
            nome_server = server.name

        ranking.push(nome_server)
    })

    if (ranking.length < 1)
        return client.tls.reply(interaction, user, "manu.data.sem_dados", true)

    dados_conhecidos = `**${client.tls.phrase(user, "manu.data.ranking_guilds")}:**\`\`\`fix\n${lista_servidores(ranking, 250, client, user)}${nota_servidores}\`\`\``

    // Listando as redes linkadas
    if (user.social) {
        dados_conhecidos += `\n:globe_with_meridians: **${client.tls.phrase(user, "manu.data.links_externos")}:**\n`

        if (user?.social.steam)
            dados_conhecidos += `\`Steam\`, `

        if (user?.social.lastfm)
            dados_conhecidos += `\`LastFM\`, `

        if (user?.social.pula_predios)
            dados_conhecidos += `\`Pula prédios\``
    }

    const user_guilds = await listAllUserGuilds(user.uid)

    if (user_guilds.length > 0)
        dados_conhecidos += `\n\n**${client.defaultEmoji("earth")} Servidores em cache:**\n\`${user_guilds.length} servidores conhecidos\``

    const id_badges = await client.getUserBadges(user.uid)

    if (id_badges.length > 0)
        dados_conhecidos += `\n\n**Badges:**\n${await buildAllBadges(client, user, id_badges)}`

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.data.dados_conhecidos"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.tls.phrase(user, "manu.data.resumo_dados")}\n\n${dados_conhecidos}`)
        .addFields(
            {
                name: `${emoji_button(user?.conf.ghost_mode)} **${client.tls.phrase(user, "manu.data.ghostmode")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${emoji_button(user?.conf.notify)} **${client.tls.phrase(user, "manu.data.notificacoes")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${emoji_button(user?.conf.ranking)} **${client.tls.phrase(user, "manu.data.ranking")}**`,
                value: "⠀",
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.data.selecionar_menus")
        })

    const row = client.create_buttons([
        { id: "data_menu_button", name: client.tls.phrase(user, "menu.botoes.central_exclusao"), type: 3, emoji: client.emoji(13), data: '1' },
        { id: "data_menu_button", name: client.tls.phrase(user, "menu.botoes.telemetria"), type: 1, emoji: client.emoji(36), data: '2' },
        { id: "data_menu_button", name: "Sincronizar servidores", type: 1, emoji: client.defaultEmoji("earth"), data: '3' }
    ], interaction)

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}

lista_servidores = (servidores, linha_corte, client, user) => {

    let nome_servidores = servidores.join(", ")

    if (nome_servidores.length > linha_corte) {

        let i = linha_corte
        nome_interno = nome_servidores.slice(0, linha_corte)
        do {
            nome_interno = nome_servidores.slice(0, i)

            i += 1
        } while (!nome_interno.includes(", "))

        nome_servidores = nome_interno
        ultima_posicao = nome_servidores.lastIndexOf(", ")

        // Quantidade de servidores listados anteriormente
        let qtd_servidores = (nome_servidores.match(/,/g) || []).length

        nome_servidores = nome_servidores.slice(0, ultima_posicao)
        servidores_restantes = servidores.length - qtd_servidores

        if (servidores_restantes > 1)
            nome_servidores = `${nome_servidores} ${client.replace(client.tls.phrase(user, "manu.data.outros_servers"), servidores_restantes)}`
        else
            nome_servidores = `${nome_servidores} ${client.tls.phrase(user, "manu.data.um_server")}`
    }

    return nome_servidores
}