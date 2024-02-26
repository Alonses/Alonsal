const { EmbedBuilder } = require('discord.js')

const { defaultUserEraser } = require('../../database/schemas/User')
const { getUserRankServers } = require('../../database/schemas/Rank_s')
const { listAllUserGuilds } = require('../../database/schemas/User_guilds')
const { buildAllBadges } = require('../../data/badges')

module.exports = async ({ client, user, interaction, operador, pagina_guia }) => {

    const pagina = pagina_guia || 0

    let dados_conhecidos = ""
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_personal.0" }]

    if (pagina === 1)
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_personal_data.0" }]

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

    if (user_guilds.length > 0)
        dados_conhecidos += `\n\n**${client.defaultEmoji("earth")} Servidores onde você possui moderação:**\n\`${user_guilds.length} servidores conhecidos\``

    const id_badges = await client.getUserBadges(user.uid)

    if (id_badges.length > 0)
        dados_conhecidos += `\n\n**Badges:**\n${await buildAllBadges(client, user, id_badges)}`

    const embed = new EmbedBuilder()
        .setTitle(`> Dados salvos de você ${client.defaultEmoji("person")}`)
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", user?.conf.ghost_mode)} **${client.tls.phrase(user, "manu.data.ghostmode")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", user?.conf.public_badges)} **${client.tls.phrase(user, "manu.data.badges_publicas")}**\n${client.execute("functions", "emoji_button.emoji_button", user?.conf.resumed)} **Modo compacto**`,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", user?.conf.notify)} **${client.tls.phrase(user, "manu.data.notificacoes")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", !user?.misc.weather)} **${client.tls.phrase(user, "manu.data.clima_resumido")}**\n${client.execute("functions", "emoji_button.emoji_button", user?.conf.cached_guilds)} **Servidores conhecidos**`,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", user?.conf.ranking)} **${client.tls.phrase(user, "manu.data.ranking")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", user?.conf.global_tasks)} **${client.tls.phrase(user, "manu.data.tarefas_globais")}**`,
                inline: true
            }
        )
        .setFooter({
            text: "Configure opções de exclusão abaixo",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        embed.setDescription(`Este é um resumo dos dados que salvei sobre você\n${dados_conhecidos}\n**Recursos configurados:**`)
    else {

        let tempo_exclusao = ""

        if (user.erase.timeout)
            tempo_exclusao = `**${client.defaultEmoji("time")} Tempo de exclusão global**:\nExcluir dados após \`${client.tls.phrase(user, `menu.times.${defaultUserEraser[user.erase.timeout]}`)}\` de inatividade\n\n**${client.defaultEmoji("time")} Tempo de exclusão por servidor**:\nExcluir dados após \`${client.tls.phrase(user, `menu.times.${defaultUserEraser[user.erase.guild_timeout]}`)}\` de inatividade no servidor.\n( Acrescido de outros \`14 dias\` após confirmação de inatividade )\n`

        embed.setDescription(`\`\`\`fix\nAo ser movido para exclusão, o Alonsal irá ignorar todas as mensagens enviadas nos chats por você, o tempo de exclusão após o período de inatividade definida é de 14 dias, dentro dessa janela ainda é possível reverter o processo de exclusão de seus dados caso use algum comando do Alonsal.\n\nA exclusão dos dados será realizada após o periodo de inatividade definido somado a outros 14 dias de forma automática, você pode definir esse tempo de inatividade através dos botões abaixo.\n\nAo apagar os dados, o Alonsal irá remover completamente os dados salvos relacionados a você, incluindo o registro de ranking de todos os servidores ao qual possui registro, todas as tarefas criadas, módulos programados e tickets de denúncia abertos.\`\`\`${tempo_exclusao}\n**Recursos do servidor:**`)
    }

    botoes.push(
        { id: "data_menu_button", name: client.tls.phrase(user, "menu.botoes.central_exclusao"), type: 3, emoji: client.emoji(13), data: '1' },
        { id: "data_user_button", name: "Definir inatividade", type: 1, emoji: client.defaultEmoji("time"), data: "5" }
    )

    if (pagina === 0)
        botoes.push({ id: "data_user_button", name: "Mais detalhes", type: 1, emoji: client.defaultEmoji("paper"), data: "1" })

    if (pagina === 1)
        botoes.push(
            { id: "data_menu_button", name: client.tls.phrase(user, "menu.botoes.telemetria"), type: 1, emoji: client.emoji(36), data: '2' },
            { id: "data_menu_button", name: "Sincronizar servidores", type: 1, emoji: client.defaultEmoji("earth"), data: '3' }
        )

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
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