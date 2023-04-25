const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { getReport } = require('../../adm/database/schemas/Report')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report users who cause problems")
        .addSubcommand(subcommand =>
            subcommand.setName("create")
                .setDescription("⌠💂⌡ Report users who cause problems")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Denuncie usuários que criam problemas',
                    "es-ES": '⌠💂⌡ Reportar usuarios que crean problemas',
                    "fr": '⌠💂⌡ Signaler les utilisateurs qui créent des problèmes',
                    "it": '⌠💂⌡ Segnala gli utenti che creano problemi',
                    "ru": '⌠💂⌡ Сообщайте о пользователях, которые создают проблемы'
                })
                .addStringOption(option =>
                    option.setName("reason")
                        .setNameLocalizations({
                            "pt-BR": 'motivo',
                            "es-ES": 'razon',
                            "fr": 'raison',
                            "it": 'motivo',
                            "ru": 'причина'
                        })
                        .setDescription("Report what happened to this user")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Relate o que aconteceu com este usuário',
                            "es-ES": 'Reportar lo que le pasó a este usuario',
                            "fr": 'Signaler ce qui est arrivé à cet utilisateur',
                            "it": 'Segnala cosa è successo a questo utente',
                            "ru": 'Сообщить о случившемся с этим пользователем'
                        })
                        .setRequired(true))
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
            subcommand.setName("remove")
                .setDescription("⌠💂⌡ Remove the report on a user")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Remova a denúncia sobre um usuário',
                    "es-ES": '⌠💂⌡ Remove a denúncia sobre um usuário',
                    "fr": '⌠💂⌡ Supprimer une denúncia sobre um usuário',
                    "it": '⌠💂⌡ Rimuovi una denuncia su un utente',
                    "ru": '⌠💂⌡ Удалить жалобу от пользователя'
                })
                .addStringOption(option =>
                    option.setName("reason")
                        .setNameLocalizations({
                            "pt-BR": 'motivo',
                            "es-ES": 'razon',
                            "fr": 'raison',
                            "it": 'motivo',
                            "ru": 'причина'
                        })
                        .setDescription("Report what happened to this user")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Relate o que aconteceu com este usuário',
                            "es-ES": 'Reportar lo que le pasó a este usuario',
                            "fr": 'Signaler ce qui est arrivé à cet utilisateur',
                            "it": 'Segnala cosa è successo a questo utente',
                            "ru": 'Сообщить о случившемся с этим пользователем'
                        })
                        .setRequired(true))
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
            subcommand.setName("migrate")
                .setDescription("⌠💂⌡ Migrate all banned users from server to alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Migre todos os usuários banidos do servidor para o alonsal',
                    "es-ES": '⌠💂⌡ Migrar todos los usuarios prohibidos del servidor a alonsal',
                    "fr": '⌠💂⌡ Migrer tous les utilisateurs bannis du serveur vers l\'alonsal',
                    "it": '⌠💂⌡ Migra tutti gli utenti bannati dal server ad alonsal',
                    "ru": '⌠💂⌡ Перевести всех забаненных пользователей с сервера на алонсал'
                })
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() !== "migrate") {

            let id_alvo = interaction.options.getUser("user") || null

            const valores = {
                id_alvo: interaction.options.getString("id"),
                report: interaction.options.getString("reason")
            }

            if (interaction.options.getUser("user"))
                id_alvo = id_alvo.id

            if (id_alvo === null)
                id_alvo = valores.id_alvo

            if (id_alvo === interaction.user.id)
                return client.tls.reply(interaction, user, "mode.report.auto_reporte", true, 0)

            if (id_alvo === null)
                return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

            if (id_alvo === client.id())
                return client.tls.reply(interaction, user, "mode.report.reportar_bot", true, 0)

            const alvo = await getReport(id_alvo, interaction.guild.id)

            // Atribuindo o reporte ao usuário que disparou o comadno
            alvo.issuer = interaction.user.id
            const date1 = new Date()

            if (interaction.options.getSubcommand() === "create") {

                alvo.archived = true
                alvo.relatory = valores.report
                alvo.timestamp = client.timestamp()

                // Enviando o embed para validação
                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(user, "mode.report.reportando", 7))
                    .addFields(
                        {
                            name: ":bust_in_silhouette: **Discord ID**",
                            value: `\`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                            inline: true
                        },
                        {
                            name: `**${client.defaultEmoji("guard")} ${client.tls.phrase(user, "mode.report.reportador")}**`,
                            value: `\`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                            inline: true
                        },
                        {
                            name: ":globe_with_meridians: **Server ID**",
                            value: `\`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                            inline: true
                        }
                    )
                    .setColor(0xED4245)
                    .setDescription(`\`\`\`💢 | ${alvo.relatory}\`\`\`\n${client.tls.phrase(user, "mode.report.descricao_report")}`)
                    .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: client.discord.user.avatarURL({ dynamic: true }) })

                // Salvando o alvo para editar posteriormente
                await alvo.save()

                // Criando os botões para as funções de reporte
                const row = client.create_buttons([{ id: "report_user", name: client.tls.phrase(user, "menu.botoes.confirmar_anunciando"), value: '1', type: 2, emoji: '📣', data: `1|${alvo.uid}` }, { id: "report_user", name: client.tls.phrase(user, "menu.botoes.apenas_confirmar"), value: '0', type: 1, emoji: '📫', data: `2|${alvo.uid}` }, { id: "report_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, emoji: '🛑', data: `0|${alvo.uid}` }], interaction)

                return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

            } else if (interaction.options.getSubcommand() === "remove") { // Relatando que o usuário teve uma atualização
                alvo.archived = true
                alvo.relatory += `\n ${valores.report}`

                client.tls.reply(interaction, user, "mode.report.usuario_att", true, 4)
            }

            await alvo.save()

        } else { // Migrando todos os usuários banidos do servidor para o repositório do bot

            // Enviando o embed para validação
            const embed = new EmbedBuilder()
                .setTitle(client.tls.phrase(user, "mode.report.automatizado"))
                .setColor(0xED4245)
                .setDescription(client.tls.phrase(user, "mode.report.descricao_automatizado"))
                .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: client.discord.user.avatarURL({ dynamic: true }) })

            // Criando os botões para a cor customizada
            const row = client.create_buttons([{ id: "report_auto", name: client.tls.phrase(user, "menu.botoes.confirmar"), value: '1', type: 2, emoji: '✅', data: 1 }, { id: "report_auto", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, emoji: '🛑', data: 0 }], interaction)

            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        }
    }
}