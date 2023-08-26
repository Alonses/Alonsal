const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

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
                        .setDescription("Mention a user")
                        .setDescriptionLocalizations({
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

        // Solicitando a função e executando
        require(`./subcommands/verify_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}