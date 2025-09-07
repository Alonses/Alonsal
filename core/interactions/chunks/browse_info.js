const { getGames, verifyInvalidGames } = require('../../database/schemas/Game')

const { getActiveModules } = require('../../database/schemas/User_modules')
const { listAllSuspiciousLinks } = require('../../database/schemas/Spam_links')

const { activities } = require('../../../files/json/text/activities.json')

module.exports = async ({ client, user, interaction, caso }) => {

    const bot = await client.getBot()
    let botoes = [], ouvindo_agora = "", info_restricoes = "", pagina = parseInt(caso) || 0
    let restricoes = []

    if (pagina === 0)
        if (activities[client.cached.presence]?.link)
            ouvindo_agora = `\`\`\`fix\n🎶 ${client.tls.phrase(user, "manu.info.ouvindo_agora")}\n${client.defaultEmoji("instrument")} ${activities[client.cached.presence].text.replace("🎶 ", "")}\`\`\`\n`

    Object.keys(bot.conf).forEach(status => {
        if (!bot.conf[status] && status !== "daily_announce" && status !== "guild_timeout") restricoes.push(status)
    })

    if (restricoes.length > 0) // Listando os recursos com restrições de funcionamento em andamento
        info_restricoes = client.tls.phrase(user, "manu.info.restricoes_ativas", null, restricoes.join("\n"))

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "manu.info.infos")}`,
        thumbnail: "https://scontent-gru1-1.xx.fbcdn.net/v/t39.30808-6/271761723_4781205238660427_2679923254801920704_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeEaDbTjIrwdCOtcagWWhVkesSC9z2rDnVexIL3PasOdV5UecFHHTVPIWqV19Eq3VfRZCnHRKRq1cLToTkrsKEim&_nc_ohc=0RgcC3ujltUAX97XDKA&_nc_oc=AQmx0z2kxoAK_y5WsuATe7C9j_M2uor_EZ2DjNPqmJD0olXXScM70c5xlhDQvVV3qVg&_nc_ht=scontent-gru1-1.xx&oh=00_AfDAgo9E37s4Nc_t_6Njz2Q3Ko5-A9be58np1JZJ0nNEOQ&oe=652140A5",
        description: `${ouvindo_agora}${info_restricoes}\n${client.tls.phrase(user, "manu.info.conteudo_1")}\n\n${client.tls.phrase(user, "manu.info.invocado_1")} \`${client.locale(bot.persis.commands + 1)}\` ${client.tls.phrase(user, "manu.info.invocado_2")} ${client.emoji("emojis_dancantes")}\n[ _${client.tls.phrase(user, "manu.info.versao")} ${bot.persis.version}_ ]\n\n${client.tls.phrase(user, "manu.info.spawn_alonsal")} <t:1618756500>`,
        footer: {
            text: client.username(),
            iconURL: client.user().avatarURL({ dynamic: true })
        }
    }, user)

    if (pagina === 1) // Dados sobre informações de suporte
        embed.setDescription(client.tls.phrase(user, "manu.info.conteudo_2", null, [client.emoji("dancando_elizabeth"), client.emoji("mc_bolo")]))

    if (pagina === 2) // Dados sobre fontes externas
        embed.setDescription(client.tls.phrase(user, "manu.info.conteudo_3"))

    if (pagina === 0) // Página inicial
        botoes.push(
            { id: "browse_info", name: { tls: "menu.botoes.estatisticas" }, type: 1, emoji: client.defaultEmoji("metrics"), data: 3 },
            { id: "browse_info", name: { tls: "inic.inicio.suporte" }, type: 1, emoji: client.emoji(25), data: 1 },
            { id: "browse_info", name: { tls: "manu.data.links_externos" }, type: 1, emoji: client.emoji(32), data: 2 },
        )
    else if (pagina === 1)
        botoes.push(
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: { tls: "inic.inicio.convidar" }, type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=2550136990` },
            { name: { tls: "manu.avalie.avaliar" }, type: 4, emoji: client.emoji("emojis_dancantes"), value: "https://top.gg/bot/833349943539531806" },
            { name: { tls: "manu.apoio.contribua" }, type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
            { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }
        )
    else if (pagina === 2)
        botoes.push(
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        )
    else if (pagina === 3) {

        // Verificando pelos games que já expiraram
        await verifyInvalidGames()

        const games_free = await getGames()
        const links_suspeitos = await listAllSuspiciousLinks()

        // Estatísticas do Alonsal
        embed.setDescription(`${client.defaultEmoji("metrics")} ${client.tls.phrase(user, "manu.info.guia_estatisticas")}`)
            .addFields(
                {
                    name: `${client.defaultEmoji("playing")} **${client.tls.phrase(user, "manu.info.miscelania")}**`,
                    value: `:mega: **${client.tls.phrase(user, "mode.report.status")}: **\`${activities.length}\`\n:video_game: **${client.tls.phrase(user, "manu.info.jogos_free")}: **\`${games_free.length || 0}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:trophy: **Ranking: **\`${bot.persis.ranking} EXP\`\n${client.emoji("carregando")} **${client.tls.phrase(user, "manu.info.modulos_ativos")}: **\`${(await getActiveModules()).length}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:white_small_square: **${client.tls.phrase(user, "manu.info.versao")} ${bot.persis.version}**`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "manu.info.de_hoje")}**`,
                    value: `${client.emoji("icon_slash_commands")} **${client.tls.phrase(user, "manu.info.comandos_usados")}: **\`${client.locale(bot.cmd.ativacoes)}\`\n${client.emoji("mc_esmeralda")} **Bufunfas: **\`${client.locale(bot.bfu.gerado)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:mouse_three_button: **${client.tls.phrase(user, "manu.info.botoes_clicados")}: **\`${client.locale(bot.cmd.botoes)}\`\n${client.emoji("mc_nether_star")} **${client.tls.phrase(user, "manu.info.xp_gerado")}: **\`${client.locale(bot.exp.exp_concedido)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:card_box: **${client.tls.phrase(user, "manu.info.menus_abertos")}: **\`${client.locale(bot.cmd.menus)}\`\n${client.emoji("icon_voice_channel")} **${client.tls.phrase(user, "manu.info.canais_gerados")}:** \`${client.locale(bot.cmd.voice_channels)}\``,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(user, "manu.info.historico")}**`,
                    value: `${client.emoji("icon_slash_commands")} **${client.tls.phrase(user, "manu.info.comandos_usados")}: **\`${client.locale(bot.persis.commands)}\`\n:globe_with_meridians: **${client.tls.phrase(user, "mode.network.servidores")}: **\`${client.locale(client.guilds().size)}\`\n:name_badge: **${client.tls.phrase(user, "manu.info.spams_freados")}: **\`${client.locale(bot.persis.spam)}\`\n:link: **${client.tls.phrase(user, "mode.spam.links_suspeitos")}:** \`${links_suspeitos.length || 0}\`\n${client.emoji("mc_esmeralda")} **Bufunfas: **\`${client.locale(bot.persis.bufunfas)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `${client.emoji("icon_slash_commands")} **${client.tls.phrase(user, "manu.info.ultimo_comando")}**\n<t:${client.cached.last_interaction}:f>\n<t:${client.cached.last_interaction}:R>`,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:satellite: **${client.tls.phrase(user, "manu.info.ativo_desde")}**\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`,
                    inline: true
                }
            )

        botoes.push(
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "browse_info" },
            { id: "browse_info", name: { tls: "menu.botoes.atualizar" }, type: 1, emoji: client.emoji(42), data: 3 },
        )

        if (games_free.length > 0) // Jogos gratuitos disponíveis para coleta
            botoes.push({ id: "free_games", name: { tls: "menu.botoes.ver_jogos_free" }, type: 1, emoji: client.emoji(29), data: 0 })
    }

    // Botão ouvindo agora
    if (ouvindo_agora !== "")
        botoes.push({ name: { tls: "menu.botoes.ouvir_tambem" }, emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
    })
}