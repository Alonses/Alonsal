const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { getUserReports, checkUserGuildReported } = require('../../adm/database/schemas/Report')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("⌠💂⌡ Check a user's history")
        .addSubcommand(subcommand =>
            subcommand.setName("user")
                .setDescription("⌠💂⌡ Check a user's history")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Verificar histórico de um usuário',
                    "es-ES": '⌠💂⌡ Consultar el historial de un usuario',
                    "fr": '⌠💂⌡ Vérifier l\'historique d\'un utilisateur',
                    "it": '⌠💂⌡ Controlla la cronologia di un utente',
                    "ru": '⌠💂⌡ Проверить историю пользователя'
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
                        }))
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("The user ID")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O ID do usuário',
                            "es-ES": 'Identificación de usuario',
                            "fr": 'ID de l\'utilisateur',
                            "it": 'ID utente',
                            "ru": 'ID пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("guild")
                .setDescription("⌠💂⌡ Check reported server users")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Verificar se há usuários reportados no servidor',
                    "es-ES": '⌠💂⌡ Verifique los usuarios del servidor informados',
                    "fr": '⌠💂⌡ Vérifier les utilisateurs de serveur signalés',
                    "it": '⌠💂⌡ Controlla gli utenti del server segnalati',
                    "ru": '⌠💂⌡ Проверьте зарегистрированных пользователей сервера'
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
                        .setMinValue(1)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, user, interaction) {

        let pagina = interaction.options.getInteger("page") || 1, i = 0
        pagina = pagina < 1 ? 1 : pagina

        // Verificando um usuário manualmente
        if (interaction.options.getSubcommand() === "user") {

            let id_alvo = interaction.options.getUser("user") || interaction.options.getString("id")

            if (!id_alvo) // Sem usuário informado
                return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

            if (typeof id_alvo === "object")
                id_alvo = id_alvo.id

            // Coletando os dados de histórico do usuário
            const reports = await getUserReports(id_alvo)
            const user_c = await client.getUser(id_alvo)
            let user_alvo = await client.getUserGuild(interaction, id_alvo) // Dados de membro do servidor

            // Usuário não faz parte do servidor
            if (!user_alvo)
                return client.tls.reply(interaction, user, "mode.report.usuario_nao_encontrado", true, 1)

            let apelido = user_alvo.nickname !== null ? user_alvo.nickname : user_alvo.user.username

            // Avatar do usuário
            let avatar_user = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.user.avatar}.gif?size=1024`

            if (avatar_user !== null) {
                avatar_user = avatar_user.replace(".webp", ".gif")

                await fetch(avatar_user)
                    .then(res => {
                        if (res.status !== 200)
                            avatar_user = avatar_user.replace('.gif', '.webp')
                    })
            } else
                avatar_user = ""

            let avisos = 0, descricao = `\`\`\`✅ | ${client.tls.phrase(user, "mode.report.sem_report")}\`\`\``
            const historico = []

            // Quantificando os relatórios sobre o usuário
            reports.forEach(valor => {
                avisos++

                historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
            })

            if (avisos > 0)
                descricao = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n").slice(0, 1000)}\`\`\``

            const infos_user = new EmbedBuilder()
                .setTitle(`> ${apelido}`)
                .setColor(client.embed_color(user_c.misc.color))
                .setThumbnail(avatar_user)
                .addFields(
                    {
                        name: ":globe_with_meridians: **Discord**",
                        value: `\`${user_alvo.user.username.replace(/ /g, "")}#${user_alvo.user.discriminator}\``,
                        inline: true
                    },
                    {
                        name: ":label: **Discord ID**",
                        value: `\`${user_alvo.id}\``,
                        inline: true
                    },
                    {
                        name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                        value: "⠀",
                        inline: true
                    }
                )
                .setDescription(descricao)

            return interaction.reply({ embeds: [infos_user], ephemeral: true })
        } else {

            await interaction.deferReply({ ephemeral: true })

            const users = [], usernames = [], user_ids = []
            const data_usuarios = await checkUserGuildReported(interaction.guild.id)

            // Salvando os dados no formato apropriado
            data_usuarios.forEach(valor => {
                users.push(valor)
            })

            // Verificando a quantidade de entradas e estimando o número de páginas
            const pages = users.length / 6
            let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)

            if (users.length / 6 < 1)
                paginas = 1

            if (users.length > 6)
                rodape = `( 1 | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "dive.rank.rodape")}`

            if (pagina > paginas) // Número de página escolhida maior que as disponíveis
                return client.tls.editReply(interaction, user, "dive.rank.error_1", client.decider(user?.conf.ghost_mode, 0), 0)

            const remover = pagina === paginas ? (pagina - 1) * 6 : users.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

            for (let x = 0; x < remover; x++)
                users.shift()

            rodape = `( ${pagina} | ${paginas} ) - ${paginas} ${client.tls.phrase(user, "dive.rank.rodape")}`

            for (const user of users) {

                if (i < 6) { // Listando os usuários que possuem denúncias e estão no servidor
                    const membro_server = await interaction.guild.members.find(member => member.id === user.uid)

                    if (membro_server) {
                        usernames.push(`${client.defaultEmoji("diamond")} <@${user.uid}>`)
                        user_ids.push(`\`${(user.uid)}\``)
                    }
                }

                i++
            }

            const embed = new EmbedBuilder()
                .setTitle(`> ${interaction.guild.name}`)
                .setColor(client.embed_color(user.misc.color))

            if (usernames.length > 1)
                embed.addFields(
                    {
                        name: `**${client.defaultEmoji("guard")} Salafrários**`,
                        value: usernames.join("\n"),
                        inline: true
                    },
                    { name: "**:label: Identificador**", value: user_ids.join("\n"), inline: true }
                )
                    .setFooter({ text: rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            else
                embed.setDescription("```✅ | Não há usuários que foram denúnciados externamente neste servidor!```")

            img_embed = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")

            fetch(img_embed).then(res => {
                if (res.status !== 200)
                    img_embed = img_embed.replace('.gif', '.webp')

                embed.setThumbnail(img_embed)

                interaction.editReply({ embeds: [embed], ephemeral: true })
            })
        }
    }
}