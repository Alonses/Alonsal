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

        if (interaction.options.getSubcommand() === "migrate")
            return require("./subcommands/report_migrate")({ client, user, interaction })
        else {

            let id_alvo = interaction.options.getUser("user") || interaction.options.getString("id")

            if (!id_alvo)
                return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

            if (typeof id_alvo === "object")
                id_alvo = id_alvo.id

            if (id_alvo === interaction.user.id)
                return client.tls.reply(interaction, user, "mode.report.auto_reporte", true, 0)

            if (id_alvo === client.id())
                return client.tls.reply(interaction, user, "mode.report.reportar_bot", true, 0)

            const alvo = await getReport(id_alvo, interaction.guild.id)

            // Atribuindo o reporte ao usuário que disparou o comadno
            alvo.issuer = interaction.user.id

            return require(`./subcommands/report_${interaction.options.getSubcommand()}`)({ client, user, interaction, alvo })
        }
    }
}