const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("⌠💂⌡ Check a user's history")
        .addSubcommand(subcommand =>
            subcommand.setName("user")
                .setDescription("⌠💂⌡ Check a user's history")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Überprüfen Sie den Verlauf eines Benutzers',
                    "es-ES": '⌠💂⌡ Consultar el historial de un usuario',
                    "fr": '⌠💂⌡ Vérifier l\'historique d\'un utilisateur',
                    "it": '⌠💂⌡ Controlla la cronologia di un utente',
                    "pt-BR": '⌠💂⌡ Verificar histórico de um usuário',
                    "ru": '⌠💂⌡ Проверить историю пользователя'
                })
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
            subcommand.setName("guild")
                .setDescription("⌠💂⌡ Check reported server users")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Suche nach gemeldeten Benutzern auf dem Server',
                    "es-ES": '⌠💂⌡ Verifique los usuarios del servidor informados',
                    "fr": '⌠💂⌡ Vérifier les utilisateurs de serveur signalés',
                    "it": '⌠💂⌡ Controlla gli utenti del server segnalati',
                    "pt-BR": '⌠💂⌡ Verificar se há usuários reportados no servidor',
                    "ru": '⌠💂⌡ Проверьте зарегистрированных пользователей сервера'
                })
                .addIntegerOption(option =>
                    option.setName("page")
                        .setNameLocalizations({
                            "de": 'seite',
                            "es-ES": 'pagina',
                            "it": 'pagina',
                            "pt-BR": 'pagina',
                            "ru": 'страница'
                        })
                        .setDescription("One page to display")
                        .setDescriptionLocalizations({
                            "de": 'Eine Seite zur Anzeige',
                            "es-ES": 'Una pagina para mostrar',
                            "fr": 'Une page à afficher',
                            "it": 'Una pagina da visualizzare',
                            "pt-BR": 'Uma página para exibir',
                            "ru": 'Одна страница для отображения'
                        })
                        .setMinValue(1)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute({ client, user, interaction }) {

        // Solicitando a função e executando
        require(`./subcommands/verify_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}