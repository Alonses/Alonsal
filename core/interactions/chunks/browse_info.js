const { EmbedBuilder } = require('discord.js')

const { getGames, verifyInvalidGames } = require('../../database/schemas/Game')

const { activities } = require('../../../files/json/text/activities.json')
const { getActiveModules } = require('../../database/schemas/Module')

module.exports = async ({ client, user, interaction, caso }) => {

    const bot = await client.getBot()
    let botoes = [], ouvindo_agora = "", pagina = parseInt(caso) || 0

    if (pagina === 0)
        if (activities[client.cached.presence]?.link) {
            ouvindo_agora = `\`\`\`fix\n🎶 ${client.tls.phrase(user, "manu.info.ouvindo_agora")}\n${client.defaultEmoji("instrument")} ${activities[client.cached.presence].text.replace("🎶 ", "")}\`\`\`\n`

            row = client.create_buttons([
                { name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 }
            ], interaction)
        }

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.info.infos")}`)
        .setColor(client.embed_color(user.misc.color))
        .setThumbnail("https://scontent-gru1-1.xx.fbcdn.net/v/t39.30808-6/271761723_4781205238660427_2679923254801920704_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeEaDbTjIrwdCOtcagWWhVkesSC9z2rDnVexIL3PasOdV5UecFHHTVPIWqV19Eq3VfRZCnHRKRq1cLToTkrsKEim&_nc_ohc=0RgcC3ujltUAX97XDKA&_nc_oc=AQmx0z2kxoAK_y5WsuATe7C9j_M2uor_EZ2DjNPqmJD0olXXScM70c5xlhDQvVV3qVg&_nc_ht=scontent-gru1-1.xx&oh=00_AfDAgo9E37s4Nc_t_6Njz2Q3Ko5-A9be58np1JZJ0nNEOQ&oe=652140A5")
        .setDescription(`${ouvindo_agora}\n${client.tls.phrase(user, "manu.info.conteudo_1")}\n\n${client.tls.phrase(user, "manu.info.invocado_1")} \`${client.locale(bot.persis.commands + 1)}\` ${client.tls.phrase(user, "manu.info.invocado_2")} ${client.emoji("emojis_dancantes")}\n[ _${client.tls.phrase(user, "manu.info.versao")} ${bot.persis.version}_ ]\n\n${client.tls.phrase(user, "manu.info.spawn_alonsal")} <t:1618756500>`)
        .setFooter({
            text: "Alon",
            iconURL: "https://i.imgur.com/K61ShGX.png"
        })

    if (pagina === 1) // Dados sobre informações de suporte
        embed.setDescription(client.replace(client.tls.phrase(user, "manu.info.conteudo_2"), [client.emoji("dancando_elizabeth"), client.emoji("mc_bolo")]))

    if (pagina === 2) // Dados sobre fontes externas
        embed.setDescription(client.tls.phrase(user, "manu.info.conteudo_3"))

    if (pagina === 0) // Página inicial
        botoes = botoes.concat([
            { id: "browse_info", name: client.tls.phrase(user, "menu.botoes.estatisticas"), type: 1, emoji: client.defaultEmoji("metrics"), data: 3 },
            { id: "browse_info", name: client.tls.phrase(user, "inic.inicio.suporte"), type: 1, emoji: client.emoji(25), data: 1 },
            { id: "browse_info", name: client.tls.phrase(user, "manu.data.links_externos"), type: 1, emoji: client.emoji(32), data: 2 },
        ])
    else if (pagina === 1)
        botoes = botoes.concat([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=2550136990` },
            { name: client.tls.phrase(user, "manu.avalie.avaliar"), type: 4, emoji: client.emoji("emojis_dancantes"), value: "https://top.gg/bot/833349943539531806" },
            { name: client.tls.phrase(user, "manu.apoio.contribua"), type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
            { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }
        ])
    else if (pagina === 2)
        botoes = botoes.concat([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        ])
    else if (pagina === 3) {

        // Verificando pelos games que já expiraram
        await verifyInvalidGames()

        const games_free = await getGames()

        // Estatísticas do Alon
        embed.setDescription(`${client.defaultEmoji("metrics")} **Algumas estatísticas minhas!**\`\`\`Há estatísticas para o dia de hoje,\ne estatísticas para o histórico do Alon!\`\`\``)
            .addFields(
                {
                    name: `${client.defaultEmoji("playing")} **Miscelânea**`,
                    value: `:mega: **Status: **\`${activities.length}\`\n:video_game: **Jogos Free: **\`${games_free.length || 0}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:trophy: **Ranking: **\`${bot.persis.ranking} EXP\`\n${client.emoji("carregando")} **Módulos ativos: **\`${(await getActiveModules()).length}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:white_small_square: **Versão ${bot.persis.version}**`,
                    inline: true
                }
            )
            .addFields(
                {
                    name: `${client.defaultEmoji("time")} **De hoje**`,
                    value: `${client.emoji("icon_slash_commands")} **Comandos usados: **\`${client.locale(bot.cmd.ativacoes)}\`\n${client.emoji("mc_esmeralda")} **Bufunfas: **\`${client.locale(bot.bfu.gerado)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:mouse_three_button: **Botões clicados: **\`${client.locale(bot.cmd.botoes)}\`\n${client.emoji("mc_nether_star")} **XP Gerado: **\`${client.locale(bot.exp.exp_concedido)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:card_box: **Menus abertos: **\`${client.locale(bot.cmd.menus)}\``,
                    inline: true
                }
            )
            .addFields(
                {
                    name: `${client.defaultEmoji("calendar")} **Do histórico**`,
                    value: `${client.emoji("icon_slash_commands")} **Comandos usados: **\`${client.locale(bot.persis.commands)}\`\n:globe_with_meridians: **Servidores: **\`${client.locale(client.guilds().size)}\`\n:name_badge: **Spams freados: **\`${client.locale(bot.persis.spam)}\`\n${client.emoji("mc_esmeralda")} **Bufunfas: **\`${client.locale(bot.persis.bufunfas)}\``,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `${client.emoji("icon_slash_commands")} **Último comando**\n<t:${bot.persis.last_interaction}:f>\n<t:${bot.persis.last_interaction}:R>`,
                    inline: true
                },
                {
                    name: "⠀",
                    value: `:satellite: **Ativo desde**\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`,
                    inline: true
                }
            )

        botoes = botoes.concat([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_info" },
            { id: "browse_info", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: 3 },
        ])

        if (games_free.length > 0) // Jogos gratuitos disponíveis para coleta
            botoes = botoes.concat([
                { id: "free_games", name: "Ver jogos Free", type: 1, emoji: client.emoji(29), data: 0 }
            ])
    }

    // Botão ouvindo agora
    if (ouvindo_agora !== "")
        botoes = botoes.concat([{ name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 }])

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}