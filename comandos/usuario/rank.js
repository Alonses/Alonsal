const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const fs = require('fs')
const { readdirSync, unlinkSync, existsSync } = require('fs')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const { busca_badges, badgeTypes } = require('../../adm/data/badges')

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("⌠👤⌡ See Alonsal's ranking")
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Veja o ranking do Alonsal',
            "es-ES": '⌠👤⌡ Ver el ranking de Alonsal',
            "fr": '⌠👤⌡ Voir le classement d\'Alonsal',
            "it": '⌠👤⌡ Guarda la classifica di Alonsal',
            "ru": '⌠👤⌡ Посмотреть рейтинг Алонсала'
        })
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
                .addStringOption(option =>
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
                        }))
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
                .addStringOption(option =>
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
                        }))),
    async execute(client, user, interaction) {

        let usuario_alvo = []
        const users = []

        let rodape = interaction.user.username, user_alvo = interaction.options.getUser('user') // Coleta o ID do usuário mencionado
        let opcoes = interaction.options.data, pagina = 1

        if (interaction.options.getSubcommand() === "server") { // Exibindo o rank normalmente

            // Filtrando os valores de entrada caso tenham sido declarados
            opcoes.forEach(valor => {
                if (valor.name === "page")
                    pagina = valor.value < 1 ? 1 : valor.value
            })

            for (const file of readdirSync(`./arquivos/data/rank/${interaction.guild.id}`)) {
                try {
                    const data = require(`../../arquivos/data/rank/${interaction.guild.id}/${file}`)

                    users.push(data)
                } catch (err) { // Erro na leitura do arquivo ( arquivo corrompido / Excluindo o arquivo )
                    unlinkSync(`./arquivos/data/rank/${interaction.guild.id}/${file}`)
                }
            }

            users.sort(function (a, b) { // Ordena os usuários em ordem decrescente
                return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0)
            })

            users.sort()

            const usernames = [], experiencias = [], levels = []

            const pages = users.length / 6
            let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

            if (users.length / 6 < 1)
                paginas = 1

            if (users.length > 6)
                rodape = `( 1 | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "dive.rank.rodape")}`

            if (!user_alvo) {
                if (pagina > paginas) // Número de página escolhida maior que as disponíveis
                    return client.tls.reply(interaction, user, "dive.rank.error_1", true, 0)

                const remover = pagina === paginas ? (pagina - 1) * 6 : users.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

                for (let x = 0; x < remover; x++)
                    users.shift()

                rodape = `( ${pagina} | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "dive.rank.rodape")}`
            }

            let i = 0

            for (const user of users) {
                if (user_alvo)
                    if (user.id === user_alvo.id) {
                        usuario_alvo.push(user.xp)
                        break
                    }

                if (i < 6) {
                    // Procurando a Badge fixada do usuário
                    const user_a = await client.getUser(user.id)

                    let fixed_badge = busca_badges(client, badgeTypes.FIXED, user_a) || ""
                    if (fixed_badge) fixed_badge = fixed_badge.emoji

                    if (parseInt(pagina) !== 1)
                        usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)
                    else
                        usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\` ${fixed_badge}`)

                    experiencias.push(`\`${client.formata_num(parseInt(user.xp))} EXP\``)
                    levels.push(`\`${client.formata_num(Math.floor(user.xp / 1000))}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``)
                }

                if (!user_alvo) // Verifica se a entrada é um ID
                    i++
            }

            let embed, img_embed

            fs.readFile('./arquivos/data/rank_value.txt', 'utf8', async function (err, data) {
                if (!user_alvo) { // Sem usuário alvo definido
                    embed = new EmbedBuilder()
                        .setTitle(`${client.tls.phrase(user, "dive.rank.rank_sv")} ${interaction.guild.name}`)
                        .setColor(client.embed_color(user.misc.color))
                        .setDescription(`\`\`\`fix\n${client.tls.phrase(user, "dive.rank.nivel_descricao")} 🎉\n-----------------------\n   >✳️> place_expX EXP <✳️<\`\`\``.replace("place_exp", parseInt(data)))
                        .addFields(
                            {
                                name: `${client.emoji(emojis.mc_honeycomb)} ${client.tls.phrase(user, "dive.rank.enceirados")}`,
                                value: usernames.join("\n"),
                                inline: true
                            },
                            {
                                name: `:postal_horn: ${client.tls.phrase(user, "dive.rank.experiencia")}`,
                                value: experiencias.join("\n"),
                                inline: true
                            },
                            {
                                name: `:beginner: ${client.tls.phrase(user, "dive.rank.nivel")}`,
                                value: levels.join("\n"),
                                inline: true
                            }
                        )
                        .setFooter({ text: rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })

                    img_embed = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")
                } else { // Com usuário alvo definido

                    if (usuario_alvo.length === 0)
                        usuario_alvo.push(0)

                    const user_a = await client.getUser(user_alvo.id)
                    let fixed_badge = busca_badges(client, badgeTypes.FIXED, user_a) || ""

                    if (fixed_badge) fixed_badge = fixed_badge.emoji

                    embed = new EmbedBuilder()
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
                            value: `\`${client.formata_num(parseInt(usuario_alvo[0] / 1000))}\` - \`${((usuario_alvo[0] % 1000) / 1000).toFixed(2)}%\``,
                            inline: true
                        },
                        { name: "⠀", value: "⠀", inline: true }
                    )

                    img_embed = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=512`
                }

                fetch(img_embed).then(res => {
                    if (res.status !== 200)
                        img_embed = img_embed.replace('.gif', '.webp')

                    embed.setThumbnail(img_embed)

                    interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
                })
            })
        } else // Ranking global
            return client.tls.reply(user, "inic.error.develop", true, 5)
    }
}