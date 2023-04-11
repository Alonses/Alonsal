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
            let entradas = interaction.options.data[0].options

            const valores = {
                id_alvo: null,
                report: null
            }

            // Coletando todas as entradas
            entradas.forEach(valor => {

                if (valor.name === "id")
                    valores.id_alvo = valor.value

                if (valor.name === "reason")
                    valores.report = valor.value
            })

            if (interaction.options.getUser("user"))
                id_alvo = id_alvo.id

            if (id_alvo === null)
                id_alvo = valores.id_alvo

            if (id_alvo === interaction.user.id)
                return interaction.reply({ content: ":octagonal_sign: | Você não pode se incluir na lista de mau comportados!", ephemeral: true })

            if (id_alvo === null)
                return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

            const alvo = await getReport(id_alvo, interaction.guild.id)

            // Atribuindo o reporte ao usuário que disparou o comadno
            alvo.issuer = interaction.user.id
            const date1 = new Date()

            if (interaction.options.getSubcommand() === "create") {

                alvo.archived = true
                alvo.relatory = valores.report
                alvo.timestamp = Math.floor(date1.getTime() / 1000)

                // Enviando o embed para validação
                const embed = new EmbedBuilder()
                    .setTitle("> Reportar usuário")
                    .addFields(
                        {
                            name: ":bust_in_silhouette: **Discord ID**",
                            value: `\`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                            inline: true
                        },
                        {
                            name: `${client.guard_emoji()} **Reportador**`,
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
                    .setDescription(`\`\`\`💢 | ${alvo.relatory}\`\`\`\nSeu reporte irá adicionar o seguinte usuário a minha lista de mau comportados.\n\nVocê pode decidir se eu irei notificar outros servidores sobre essa inclusão, se irei adicionar ele em silêncio ou se deseja cancelar este reporte.`)
                    .setFooter({ text: 'Selecione a operação desejada nos botões abaixo.', iconURL: client.discord.user.avatarURL({ dynamic: true }) })

                // Salvando o alvo para editar posteriormente
                await alvo.save()

                // Criando os botões para a cor customizada
                const row = client.create_buttons([{ name: `Adicionar e anunciar:report_user`, value: '1', type: 2, report: alvo.uid }, { name: `Adicionar silenciosamente:report_user`, value: '0', type: 1, report: alvo.uid }, { name: 'Cancelar:report_user', value: '0', type: 3, report: true, report: alvo.uid }], interaction)

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
                .setTitle("> Reporte automatizado")
                .setDescription(`Seu reporte irá adicionar todos os usuários possuem justificativas e que estão banidos neste servidor à minha lista de usuários mau comportados.\n\n Usuários importados de forma automática não são mencionados para outros servidores, mas são exibidos em suas listas com o comando /verify server, caso os mesmos sejam membros de tal.`)
                .setColor(0xED4245)
                .setFooter({ text: 'Confirme ou cancele a operação nos botões abaixo.', iconURL: client.discord.user.avatarURL({ dynamic: true }) })

            // Criando os botões para a cor customizada
            const row = client.create_buttons([{ name: `Confirmar:report_auto`, value: '1', type: 2 }, { name: 'Cancelar:report_auto', value: '0', type: 3 }], interaction)

            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        }
    }
}