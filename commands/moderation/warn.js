const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("⌠💂⌡ Warn a member")
        .addSubcommand(subcommand =>
            subcommand.setName("create")
                .setDescription("⌠💂⌡ Warn a member")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Ein Mitglied warnen',
                    "es-ES": '⌠💂⌡ Advertir a un miembro',
                    "fr": '⌠💂⌡ Avertir un membre',
                    "it": '⌠💂⌡ Avvisa un membro',
                    "pt-BR": '⌠💂⌡ Advertir um membro',
                    "ru": '⌠💂⌡ Предупредить участника'
                })
                .addStringOption(option =>
                    option.setName("reason")
                        .setNameLocalizations({
                            "de": 'grund',
                            "es-ES": 'razon',
                            "fr": 'raison',
                            "it": 'motivo',
                            "pt-BR": 'motivo',
                            "ru": 'причина'
                        })
                        .setDescription("Report what happened to this user")
                        .setDescriptionLocalizations({
                            "de": 'Melden Sie, was mit diesem Benutzer passiert ist',
                            "es-ES": 'Reportar lo que le pasó a este usuario',
                            "fr": 'Signaler ce qui est arrivé à cet utilisateur',
                            "it": 'Segnala cosa è successo a questo utente',
                            "pt-BR": 'Relate o que aconteceu com este usuário',
                            "ru": 'Сообщить о случившемся с этим пользователем'
                        })
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "de": 'benutzer',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "pt-BR": 'usuario',
                            "ru": 'пользователь'
                        })
                        .setDescription("Mention a user")
                        .setDescriptionLocalizations({
                            "de": 'Erwähnen Sie einen anderen Benutzer',
                            "es-ES": 'Mencionar a otro usuario',
                            "fr": 'Mentionner un utilisateur',
                            "it": 'Menziona un altro utente',
                            "pt-BR": 'Mencione outro usuário',
                            "ru": 'Упомянуть другого пользователя'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("⌠💂⌡ Remove a member's warn")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Entfernen Sie die Warnung eines Mitglieds',
                    "es-ES": '⌠💂⌡ Eliminar la advertencia de un miembro',
                    "fr": '⌠💂⌡ Supprimer l\'avertissement d\'un membre',
                    "it": '⌠💂⌡ Rimuovere l\'avviso di un membro',
                    "pt-BR": '⌠💂⌡ Remova a advertência de um membro',
                    "ru": '⌠💂⌡ Удалить предупреждение участника'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers),
    async execute({ client, user, interaction }) {

        const guild = await client.getGuild(interaction.guild.id)

        if (!guild.conf.warn || !guild.warn.channel) // Verificando se o comando está configurado
            return interaction.reply({ content: ":passport_control: | Você precisa ativar esse recurso e definir um canal de avisos de advertências pelo painel do servidor!", ephemeral: true })

        // Redirecionando o evento
        require(`./subcommands/warn_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}