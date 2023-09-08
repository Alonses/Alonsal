const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("⌠👤⌡ See Alonsal's ranking")
        .addSubcommand(subcommand =>
            subcommand.setName("server")
                .setDescription("⌠👤⌡ See server ranking")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Serverranking anzeigen',
                    "es-ES": '⌠👤⌡ Ver el ranking en el servidor',
                    "fr": '⌠👤⌡ Voir le classement des serveurs',
                    "it": '⌠👤⌡ Vedi classifica server',
                    "pt-BR": '⌠👤⌡ Veja o ranking do servidor',
                    "ru": '⌠👤⌡ Посмотреть рейтинг серверов'
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
                        .setMinValue(1))
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
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("global")
                .setDescription("⌠👤⌡ See the global ranking")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Schauen Sie sich das globale Ranking an',
                    "es-ES": '⌠👤⌡ Ver el ranking mundial',
                    "fr": '⌠👤⌡ Voir le classement mondial',
                    "it": '⌠👤⌡ Guarda la classifica globale',
                    "pt-BR": '⌠👤⌡ Veja o ranking global',
                    "ru": '⌠👤⌡ Смотрите глобальный рейтинг'
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
                        .setMinValue(1))),
    async execute(client, user, interaction) {

        await interaction.deferReply({
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })

        require('../../core/formatters/chunks/model_rank')(client, user, interaction)
    }
}