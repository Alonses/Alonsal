const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

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
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers || PermissionFlagsBits.KickMembers),
    async execute(client, user, interaction) {

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

        if (id_alvo === null)
            return client.tls.reply(interaction, user, "mode.report.sem_usuario", true, 0)

        // Verificando se o usuário faz parte do servidor
        let dados_alvo = await interaction.guild.members.fetch(id_alvo) || null

        if (!dados_alvo)
            return interaction.reply({ content: ":mag: | Este usuário não faz parte desse servidor.", ephemeral: true })

        const alvo = await getReport(id_alvo, interaction.guild.id)
        const date1 = new Date()

        if (interaction.options.getSubcommand() === "create") {

            alvo.archived = false
            alvo.relatory = valores.report
            alvo.timestamp = Math.floor(date1.getTime() / 1000)

            client.tls.reply(interaction, user, "mode.report.usuario_add", true, 4)

            require('../../adm/automaticos/dispara_reporte')({ client, alvo, dados_alvo })
        } else { // Relatando que o usuário teve uma atualização
            alvo.archived = true
            alvo.relatory += `\n ${valores.report}`

            client.tls.reply(interaction, user, "mode.report.usuario_att", true, 4)
        }

        await alvo.save()
    }
}