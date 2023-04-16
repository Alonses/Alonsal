const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

const { buildAllBadges } = require('../../adm/data/badges')

// const busca_achievements = require('../../adm/data/conquistas')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("⌠👤⌡ View user details")
        .addSubcommand(subcommand =>
            subcommand
                .setName("avatar")
                .setDescription("⌠👤⌡ The user's avatar")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ O Avatar do usuário',
                    "es-ES": '⌠👤⌡ El avatar de usuario',
                    "fr": '⌠👤⌡ L\'avatar de l\'utilisateur',
                    "it": '⌠👤⌡ L\'utente avatar',
                    "ru": '⌠👤⌡ Аватар пользователя'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("⌠👤⌡ User Information")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Informações do usuário',
                    "es-ES": '⌠👤⌡ Información del usuario',
                    "fr": '⌠👤⌡ Informations utilisateur',
                    "it": '⌠👤⌡ Informazioni sull\'utente',
                    "ru": '⌠👤⌡ Информация о пользователе'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("banner")
                .setDescription("⌠👤⌡ The user's banner")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Banner do usuário',
                    "es-ES": '⌠👤⌡ Banner de usuario',
                    "fr": '⌠👤⌡ Bannière utilisateur',
                    "it": '⌠👤⌡ Bandiera dell\'utente',
                    "ru": '⌠👤⌡ пользовательский баннер'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque outro usuário como alvo',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur comme cible',
                            "it": 'Menziona un altro utente',
                            "ru": 'Упомянуть другого пользователя'
                        }))),
    async execute(client, user, interaction) {

        let user_alvo = interaction.options.getUser("user") || interaction.user
        const user_c = await client.getUser(user_alvo.id)

        // user_alvo -> usuário marcado pelo comando
        // user -> usuário que disparou o comando

        // User info
        if (interaction.options.getSubcommand() === "info") {
            let avatar_user = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=1024`

            const membro_sv = await client.getUserGuild(interaction, user_alvo.id) // Coleta dados como membro
            let data_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:f>`
            let diferenca_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:R>`

            let data_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:f>` // Cadastro do usuário
            let diferenca_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:R>`
            let nota_rodape = ""

            let apelido = membro_sv.user.username, tipo_user = "🤖"

            if (avatar_user !== null) {

                await fetch(avatar_user)
                    .then(res => {
                        if (res.status !== 200)
                            avatar_user = avatar_user.replace('.gif', '.webp')
                    })
            } else
                avatar_user = ""

            if (membro_sv.user.nickname)
                apelido = membro_sv.user.nickname

            if (membro_sv.permissions.has(PermissionsBitField.Flags.Administrator)) {
                tipo_user = "🛡️"
                nota_rodape = client.tls.phrase(user, "util.user.moderador")
            }

            if (!tipo_user.includes("🛡️") && !user_alvo.bot)
                tipo_user = client.defaultEmoji("person")

            if (user_alvo.id === client.id())
                nota_rodape = client.tls.phrase(user, "util.user.alonsal")

            if (process.env.ids_enceirados.includes(user_alvo.id)) {
                if (nota_rodape !== "")
                    nota_rodape += ", "

                nota_rodape += client.tls.phrase(user, "util.user.enceirado")
            }

            const permissoes_user = membro_sv.permissions.toArray()
            let permissoes_fn = ""

            for (let i = 0; i < permissoes_user.length; i++) {
                if (typeof permissoes_user[i + 1] === "undefined")
                    permissoes_fn += " & "

                permissoes_fn += `\`${permissoes_user[i]}\``

                if (typeof permissoes_user[i + 2] !== "undefined")
                    permissoes_fn += ", "
            }

            permissoes_fn = permissoes_fn.slice(0, 2000)
            let emoji_hypesquad = "⠀", discord_premium = "⠀"
            const flags_user = user_alvo.flags.toArray()

            if (!user_alvo.bot) {
                if (flags_user.includes("HypeSquadOnlineHouse1")) // HypeSquad
                    emoji_hypesquad = client.emoji(emojis.squad_bravery)

                if (flags_user.includes("HypeSquadOnlineHouse2"))
                    emoji_hypesquad = client.emoji(emojis.squad_brilliance)

                if (flags_user.includes("HypeSquadOnlineHouse3"))
                    emoji_hypesquad = client.emoji(emojis.squad_balance)

                if (flags_user.includes("PremiumEarlySupporter"))
                    discord_premium = client.emoji(emojis.early_supporter)

                if (membro_sv.premiumSinceTimestamp) // Impulsionadores do servidor
                    discord_premium += ` ${client.emoji(emojis.boost)}`
            }

            let id_badges = await client.getUserBadges(user_alvo.id)
            let badges = await buildAllBadges(client, user, id_badges)
            // let achievements = busca_achievements(client, all, user.id, interaction)

            const infos_user = new EmbedBuilder()
                .setTitle(`> ${apelido} ${emoji_hypesquad} ${discord_premium}`)
                .setColor(client.embed_color(user_c.misc.color))
                .setThumbnail(avatar_user)
                .addFields(
                    {
                        name: ":globe_with_meridians: **Discord**",
                        value: `\`${user_alvo.username.replace(/ /g, "")}#${user_alvo.discriminator}\``,
                        inline: true
                    },
                    {
                        name: ":label: **Discord ID**",
                        value: `\`${user_alvo.id}\``,
                        inline: true
                    }
                )
                .addFields(
                    {
                        name: `:birthday: **${client.tls.phrase(user, "util.user.conta_criada")}**`,
                        value: `${data_criacao}\n[ ${diferenca_criacao} ]`,
                        inline: false
                    },
                    {
                        name: `:parachute: **${client.tls.phrase(user, "util.user.entrada")}**`,
                        value: `${data_entrada}\n[ ${diferenca_entrada} ]`,
                        inline: false
                    }
                )
                .setFooter({ text: `${tipo_user} ${nota_rodape}` })

            if (badges.length > 0)
                infos_user.addFields({
                    name: ":trophy: **Badges**",
                    value: badges,
                    inline: false
                })

            return interaction.reply({ embeds: [infos_user], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

            // O avatar do usuário
        } else if (interaction.options.getSubcommand() === "avatar") {

            const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

            if (!url_avatar)
                return interaction.reply({ content: client.tls.phrase(user, "util.avatar.sem_avatar"), ephemeral: true })

            const embed = new EmbedBuilder()
                .setTitle(`> ${user_alvo.username}`)
                .setColor(client.embed_color(user_c.misc.embed))
                .setImage(url_avatar)
                .setDescription(client.tls.phrase(user, "util.avatar.download_avatar").replace("link_repl", url_avatar))

            interaction.reply({ embeds: [embed], ephemeral: true })

            // Banner do usuário
        } else {

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
                            return interaction.reply({ content: client.tls.phrase(user, "util.avatar.sem_banner"), ephemeral: true })

                        // Exibindo o banner do usuário
                        const embed = new EmbedBuilder()
                            .setTitle(`> ${user_alvo.username}`)
                            .setColor(client.embed_color(user_c.misc.embed))
                            .setImage(url_banner)
                            .setDescription(client.tls.phrase(user, "util.avatar.download_banner").replace("link_repl", url_banner))

                        interaction.reply({ embeds: [embed], ephemeral: true })
                    })
                }
            })
        }
    }
}