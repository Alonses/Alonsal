const { getUserRankServers } = require('../../database/schemas/User_rank_guild')
const { listAllUserGuilds } = require('../../database/schemas/User_guilds')
const { listAllGuildHoster } = require('../../database/schemas/Guild')
const { buildAllBadges } = require('../../data/user_badges')

const { defaultUserEraser } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, operador, pagina_guia }) => {

    const pagina = pagina_guia || 0
    const ranking = [], guilds_ranking = await getUserRankServers(user.uid)

    let dados_conhecidos = "", nota_servidores = "", reback = pagina === 1 ? "panel_personal_data.0" : "panel_personal.0"
    let botoes = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback }]

    // Listando os servidores que o usuário possui ranking
    if (guilds_ranking)
        guilds_ranking.forEach(valor => {
            let server = client.guilds().get(client.decifer(valor.sid))

            if (!server) {
                nome_server = client.tls.phrase(user, "manu.data.server_desconhecido")
                nota_servidores = `\n\n${client.tls.phrase(user, "manu.data.nota_servidores", 1)}`
            } else
                nome_server = server.name

            ranking.push(nome_server)
        })

    if (ranking.length < 1)
        return client.tls.reply(interaction, user, "manu.data.sem_dados", true, 1)

    dados_conhecidos = `\n**${client.tls.phrase(user, "manu.data.ranking_guilds")}:**\`\`\`fix\n${lista_servidores(ranking, 250, client, user)}${nota_servidores}\`\`\``

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
    const guilds_hoster = await listAllGuildHoster(user.uid)

    if (user_guilds.length > 0)
        dados_conhecidos += `\n\n**${client.defaultEmoji("earth")} ${client.tls.phrase(user, "manu.data.servidores_com_moderacao")}:**\n\`${user_guilds.length} ${client.tls.phrase(user, "manu.data.servidores_conhecidos")}\``

    if (guilds_hoster.length > 0)
        dados_conhecidos += `\n\n**${client.emoji("aln_hoster")} ${client.tls.phrase(user, "manu.data.hoster_convites", null, guilds_hoster.length)}**`

    const id_badges = await client.getUserBadges(user.uid)

    if (id_badges.length > 0)
        dados_conhecidos += `\n\n**Badges:**\n${await buildAllBadges(client, user, id_badges)}`

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "manu.data.dados_salvos")} ${client.defaultEmoji("person")}`,
        fields: [
            {
                name: `${client.execute("button_emoji", user?.conf.ghost_mode)} **${client.tls.phrase(user, "manu.data.ghostmode")}**`,
                value: `${client.execute("button_emoji", user?.conf.public_badges)} **${client.tls.phrase(user, "manu.data.badges_publicas")}**\n${client.execute("button_emoji", user?.conf.resumed)} **${client.tls.phrase(user, "manu.painel.modo_compacto")}**`,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", user?.conf.notify)} **${client.tls.phrase(user, "manu.data.notificacoes")}**`,
                value: `${client.execute("button_emoji", !user?.misc.weather)} **${client.tls.phrase(user, "manu.data.clima_resumido")}**\n${client.execute("button_emoji", user?.conf.cached_guilds)} **${client.tls.phrase(user, "manu.painel.servidores_conhecidos")}**`,
                inline: true
            },
            {
                name: `${client.execute("button_emoji", user?.conf.ranking)} **${client.tls.phrase(user, "manu.data.ranking")}**`,
                value: `${client.execute("button_emoji", user?.conf.global_tasks)} **${client.tls.phrase(user, "manu.data.tarefas_globais")}**`,
                inline: true
            }
        ],
        footer: {
            text: { tls: "manu.data.selecionar_operacoes_exclusao" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    if (pagina === 0) embed.setDescription(client.tls.phrase(user, "manu.data.resumo_dados", null, dados_conhecidos))
    else {

        let tempo_exclusao = ""

        if (user.erase.timeout)
            tempo_exclusao = `\n**${client.defaultEmoji("time")} ${client.tls.phrase(user, "manu.data.tempo_exclusao_global")}**:\n${client.tls.phrase(user, "manu.data.excluir_apos")} \`${client.tls.phrase(user, `menu.times.${defaultUserEraser[user.erase.timeout]}`)}\` ${client.tls.phrase(user, "manu.data.de_inatividade")}\n\n**${client.defaultEmoji("time")} ${client.tls.phrase(user, "manu.data.tempo_por_servidor")}**:\n${client.tls.phrase(user, "manu.data.excluir_apos")} \`${client.tls.phrase(user, `menu.times.${defaultUserEraser[user.erase.guild_timeout]}`)}\` ${client.tls.phrase(user, "manu.data.inatividade_2")}`

        embed.setDescription(client.tls.phrase(user, "manu.data.resumo_detalhado", null, tempo_exclusao))
    }

    botoes.push(
        { id: "data_menu_button", name: { tls: "menu.botoes.central_exclusao" }, type: 3, emoji: client.emoji(13), data: '1' },
        { id: "data_user_button", name: { tls: "menu.botoes.definir_inatividade" }, type: 3, emoji: client.defaultEmoji("time"), data: "5" }
    )

    if (pagina === 0)
        botoes.push({ id: "data_user_button", name: { tls: "menu.botoes.mais_detalhes" }, type: 0, emoji: client.defaultEmoji("paper"), data: "1" })

    if (pagina === 1)
        botoes.push(
            { id: "data_menu_button", name: { tls: "menu.botoes.telemetria" }, type: 0, emoji: client.emoji(36), data: '2' },
            { id: "data_menu_button", name: { tls: "menu.botoes.sincronizar_servidores" }, type: 0, emoji: client.defaultEmoji("earth"), data: '3' }
        )

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
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
            nome_servidores = `${nome_servidores} ${client.tls.phrase(user, "manu.data.outros_servers", null, servidores_restantes)}`
        else
            nome_servidores = `${nome_servidores} ${client.tls.phrase(user, "manu.data.um_server")}`
    }

    return nome_servidores
}