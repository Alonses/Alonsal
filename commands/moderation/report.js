const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { getReport } = require('../../core/database/schemas/Report')

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
                        .setDescription("Mention a user")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Mencione outro usuário',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur',
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
                        .setDescription("Mention a user")
                        .setDescriptionLocalizations({
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur',
                            "it": 'Menziona un altro utente',
                            "pt-BR": 'Mencione outro usuário',
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
                .setDescription("⌠💂⌡ Migrate all banned users from server to Alonsal")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Migre todos os usuários banidos do servidor para o Alonsal',
                    "es-ES": '⌠💂⌡ Migrar todos los usuarios prohibidos del servidor a Alonsal',
                    "fr": '⌠💂⌡ Migrer tous les utilisateurs bannis du serveur vers l\'Alonsal',
                    "it": '⌠💂⌡ Migra tutti gli utenti bannati dal server ad Alonsal',
                    "ru": '⌠💂⌡ Перевести всех забаненных пользователей с сервера на алонсал'
                })
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "migrate")
            return require("./subcommands/report_migrate")({ client, user, interaction })
        else {

            let id_alvo = interaction.options.getUser("user") || interaction.options.getString("id")

            if (!id_alvo)
                return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, client.emoji(0))

            if (typeof id_alvo === "object")
                id_alvo = id_alvo.id

            if (id_alvo === interaction.user.id) // Impede que o usuário se auto reporte
                return client.tls.reply(interaction, user, "mode.report.auto_reporte", true, client.emoji(0))

            if (id_alvo === client.id()) // Impede que o usuário reporte o bot
                return client.tls.reply(interaction, user, "mode.report.reportar_bot", true, client.emoji(0))

            if (isNaN(id_alvo) || id_alvo.length < 18) // ID inválido
                return client.tls.reply(interaction, user, "mode.report.id_invalido", true, client.defaultEmoji("types"))

            const membro_guild = await client.getMemberGuild(interaction, id_alvo)
                .catch(() => { return null })

            if (membro_guild?.user.bot) // Impede que outros bots sejam reportados
                return client.tls.reply(interaction, user, "mode.report.usuario_bot", true, client.emoji(0))

            const alvo = await getReport(id_alvo, interaction.guild.id)

            // Atribuindo o reporte ao usuário que disparou o comando
            alvo.issuer = interaction.user.id

            return require(`./subcommands/report_${interaction.options.getSubcommand()}`)({ client, user, interaction, alvo })
        }
    }
}