const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("⌠👤⌡ See Alonsal's ranking")
        .addSubcommand(subcommand =>
            subcommand.setName("server")
                .setDescription("⌠👤⌡ See server ranking")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking do servidor',
                    "es-ES": '⌠👤⌡ Ver el ranking en el servidor',
                    "fr": '⌠👤⌡ Voir le classement des serveurs',
                    "it": '⌠👤⌡ Vedi classifica server',
                    "ru": '⌠👤⌡ Посмотреть рейтинг серверов'
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
                        .setMinValue(1))
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("User to display")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Usuário para exibir',
                            "es-ES": 'Usuario a mostrar',
                            "fr": 'Utilisateur à afficher',
                            "it": 'Utente da visualizzare',
                            "ru": 'Пользователь для отображения'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("global")
                .setDescription("⌠👤⌡ See the global ranking")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Veja o ranking global',
                    "es-ES": '⌠👤⌡ Ver el ranking mundial',
                    "fr": '⌠👤⌡ Voir le classement mondial',
                    "it": '⌠👤⌡ Guarda la classifica globale',
                    "ru": '⌠👤⌡ Смотрите глобальный рейтинг'
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
                        .setMinValue(1))),
    async execute(client, user, interaction) {

        await interaction.deferReply({
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })

        require('../../core/formatters/chunks/model_rank')(client, user, interaction)
    }
}