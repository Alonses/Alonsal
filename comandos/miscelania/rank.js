const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')
const { getRankGlobal } = require('../../adm/database/schemas/Rank_g')
const { getRankServer } = require('../../adm/database/schemas/Rank_s')

const { emojis } = require('../../arquivos/json/text/emojis.json')

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("⌠👤⌡ See Alonsal's ranking")
        .addSubcommand(subcommand =>
            subcommand.setName("server")
                .setDescription("⌠👤⌡ See server ranking")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking do servidor',
                    "es-ES": '⌠👤⌡ Ver el ranking en el servidor',
                    "fr": '⌠👤⌡ Voir le classement des serveurs',
                    "it": '⌠👤⌡ Vedi classifica server',
                    "ru": '⌠👤⌡ Посмотреть рейтинг серверов'
                })
                .addIntegerOption(option =>
                    option.setName("page")
                        .setNameLocalizations({
                            "pt-BR": 'pagina',
                            "es-ES": 'pagina',
                            "it": 'pagina',
                            "ru": 'страница'
                        })
                        .setDescription("One page to display")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma página para exibir',
                            "es-ES": 'Una pagina para mostrar',
                            "fr": 'Une page à afficher',
                            "it": 'Una pagina da visualizzare',
                            "ru": 'Одна страница для отображения'
                        })
                        .setMinValue(1))
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("User to display")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Usuário para exibir',
                            "es-ES": 'Usuario a mostrar',
                            "fr": 'Utilisateur à afficher',
                            "it": 'Utente da visualizzare',
                            "ru": 'Пользователь для отображения'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("global")
                .setDescription("⌠👤⌡ See the global ranking")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking global',
                    "es-ES": '⌠👤⌡ Ver el ranking mundial',
                    "fr": '⌠👤⌡ Voir le classement mondial',
                    "it": '⌠👤⌡ Guarda la classifica globale',
                    "ru": '⌠👤⌡ Смотрите глобальный рейтинг'
                })
                .addIntegerOption(option =>
                    option.setName("page")
                        .setNameLocalizations({
                            "pt-BR": 'pagina',
                            "es-ES": 'pagina',
                            "it": 'pagina',
                            "ru": 'страница'
                        })
                        .setDescription("One page to display")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma página para exibir',
                            "es-ES": 'Una pagina para mostrar',
                            "fr": 'Une page à afficher',
                            "it": 'Una pagina da visualizzare',
                            "ru": 'Одна страница для отображения'
                        })
                        .setMinValue(1))),
    async execute(client, user, interaction) {

        let usuario_alvo = [], i = 0, data_usuarios, remover = 0
        const users = [], usernames = [], experiencias = [], levels = [], servers = []

        await interaction.deferReply({ ephemeral: client.decider(user?.conf.ghost_mode, 0) })

        // Coleta o ID do usuário mencionado
        let rodape = interaction.user.username, user_alvo = interaction.options.getUser("user")
        let pagina = interaction.options.getInteger("page") || 1

        pagina = pagina < 1 ? 1 : pagina

        // Coletando os dados para o servidor ou para o global
        if (interaction.options.getSubcommand() === "server")
            data_usuarios = await getRankServer(interaction.guild.id)
        else
            data_usuarios = await getRankGlobal()

        // Sem dados salvos no banco de ranking para o servidor especificado
        if (data_usuarios == null)
            return client.tls.editReply(interaction, user, "dive.rank.error_2", client.decider(user?.conf.ghost_mode, 0), 1)

        // Salvando os dados no formato apropriado
        data_usuarios.forEach(valor => {
            users.push(valor)
        })

        // Ordena os usuários em ordem decrescente de XP
        users.sort(function (a, b) {
            return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0)
        })

        // Verificando a quantidade de entradas e estimando o número de páginas
        const pages = users.length / 6
        let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

        if (users.length / 6 < 1)
            paginas = 1

        if (users.length > 6)
            rodape = `( 1 | ${paginas} ) - ${paginas}`

        if (!user_alvo) {
            if (pagina > paginas) // Número de página escolhida maior que as disponíveis
                return client.tls.editReply(interaction, user, "dive.rank.error_1", client.decider(user?.conf.ghost_mode, 0), 0)

            remover = pagina === paginas ? (pagina - 1) * 6 : users.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

            for (let x = 0; x < remover; x++)
                users.shift()

            rodape = `( ${pagina} | ${paginas} ) - ${paginas}`
        }

        const user_i = user

        for (const user of users) {
            if (user_alvo)
                if (user.uid === user_alvo.id) {
                    usuario_alvo.push(user.xp)
                    break
                }

            if (i < 6) {
                // Procurando a Badge fixada do usuário
                const user_a = await client.getUser(user.uid)

                let fixed_badge = busca_badges(client, badgeTypes.FIXED, user_a) || ""
                if (fixed_badge) fixed_badge = fixed_badge.emoji

                if (parseInt(pagina) !== 1)
                    usernames.push(`${client.defaultEmoji("person")} #${remover + i + 1} \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)
                else
                    usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)

                experiencias.push(`\`${client.locale(parseInt(user.xp))} EXP\``)

                if (interaction.options.getSubcommand() === "server")
                    levels.push(`\`${client.locale(Math.floor(user.xp / 1000))}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``)
                else {

                    let server = client.guilds().get(user.sid || '0')

                    if (!server)
                        nome_server = client.tls.phrase(user_i, "manu.data.server_desconhecido")
                    else
                        nome_server = server.name

                    servers.push(`\`${nome_server}\``)
                }

                if (!user_alvo) // Verifica se a entrada é um ID
                    i++
            }
        }

        if (interaction.options.getSubcommand() === "server") { // Exibindo o rank normalmente

            if (!user_alvo) // Sem usuário alvo definido
                retorna_ranking(client, interaction, user, usernames, experiencias, levels, servers, rodape)
            else { // Com usuário alvo definido

                if (usuario_alvo.length === 0)
                    usuario_alvo.push(0)

                const user_a = await client.getUser(user_alvo.id)
                let fixed_badge = busca_badges(client, badgeTypes.FIXED, user_a) || ""

                if (fixed_badge) fixed_badge = fixed_badge.emoji

                const embed = new EmbedBuilder()
                    .setTitle(`${user_alvo.username} ${fixed_badge}`)
                    .setColor(client.embed_color(user_a.misc.color))
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })

                embed.addFields(
                    {
                        name: `:postal_horn: ${client.tls.phrase(user, "dive.rank.experiencia")}`,
                        value: `\`${usuario_alvo[0].toFixed(2)} EXP\``,
                        inline: true
                    },
                    {
                        name: `:beginner: ${client.tls.phrase(user, "dive.rank.nivel")}`,
                        value: `\`${client.locale(parseInt(usuario_alvo[0] / 1000))}\` - \`${((usuario_alvo[0] % 1000) / 1000).toFixed(2)}%\``,
                        inline: true
                    },
                    { name: "⠀", value: "⠀", inline: true }
                )

                let img_embed = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=512`

                fetch(img_embed).then(res => {
                    if (res.status !== 200)
                        img_embed = img_embed.replace('.gif', '.webp')

                    embed.setThumbnail(img_embed)

                    interaction.editReply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                })
            }
        } else // Ranking global
            retorna_ranking(client, interaction, user, usernames, experiencias, levels, servers, rodape)
    }
}

async function retorna_ranking(client, interaction, user, usernames, experiencias, levels, servers, rodape) {

    const bot = await client.getBot()

    // Apenas é mostrado caso seja verificação por servidor
    let descricao_banner = `${client.tls.phrase(user, "dive.rank.nivel_descricao")} 🎉\n-----------------------\n`
    let nome_embed = `${client.tls.phrase(user, "dive.rank.rank_sv")} ${interaction.guild.name}`

    if (interaction.options.getSubcommand() !== "server") {
        descricao_banner = ""
        nome_embed = client.tls.phrase(user, "dive.rank.rank_global")
        rodape = `${rodape} ${client.tls.phrase(user, "dive.rank.rodape_global")}`  // Rodapé do rank global
    } else // Rodapé do rank de servidor
        rodape = `${rodape} ${client.tls.phrase(user, "dive.rank.rodape")}`

    const embed = new EmbedBuilder()
        .setTitle(nome_embed)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.replace(`\`\`\`fix\n${descricao_banner}   >✳️> auto_replX EXP <✳️<\`\`\``, bot.persis.ranking))
        .addFields(
            {
                name: `${client.emoji(emojis.mc_honeycomb)} ${client.tls.phrase(user, "dive.rank.enceirados")}`,
                value: usernames.join("\n"),
                inline: true
            },
            {
                name: `:postal_horn: **${client.tls.phrase(user, "dive.rank.experiencia")}**`,
                value: experiencias.join("\n"),
                inline: true
            }
        )
        .setFooter({ text: rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })

    if (interaction.options.getSubcommand() === "server")
        embed.addFields(
            {
                name: `:beginner: **${client.tls.phrase(user, "dive.rank.nivel")}**`,
                value: levels.join("\n"),
                inline: true
            }
        )
    else
        embed.addFields(
            {
                name: `:globe_with_meridians: **${client.tls.phrase(user, "util.canal.servidor")}**`,
                value: servers.join("\n"),
                inline: true
            }
        )

    img_embed = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")

    fetch(img_embed).then(res => {
        if (res.status !== 200)
            img_embed = img_embed.replace('.gif', '.webp')

        embed.setThumbnail(img_embed)

        interaction.editReply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    })
}