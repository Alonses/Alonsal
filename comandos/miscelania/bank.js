const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bank")
        .setNameLocalizations({
            "es-ES": 'banco',
            "fr": 'banque',
            "it": 'banca',
            "pt-BR": 'banco',
            "ru": 'банк'
        })
        .setDescription("⌠💸⌡ See your Bufunfas")
        .addSubcommand(subcommand =>
            subcommand
                .setName("statement")
                .setNameLocalizations({
                    "de": 'extrakt',
                    "es-ES": 'extracto',
                    "fr": 'extrait',
                    "it": 'estratto',
                    "pt-BR": 'extrato',
                    "ru": 'счет'
                })
                .setDescription("⌠💸⌡ See your Bufunfas")
                .setDescriptionLocalizations({
                    "de": '⌠💸⌡ Überprüfen Sie Ihre Bufunfas',
                    "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
                    "fr": '⌠💸⌡ Voir vos Bufunfas',
                    "it": '⌠💸⌡ Visualizza il tuo Bufunfa',
                    "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
                    "ru": '⌠💸⌡ посмотреть свой Bufunfa'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "de": 'benutzer',
                            "es-ES": 'usuario',
                            "fr": 'user',
                            "it": 'utente',
                            "pt-BR": 'usuario',
                            "ru": 'пользователь'
                        })
                        .setDescription("View another user\'s bank")
                        .setDescriptionLocalizations({
                            "de": 'Überprüfen Sie die Bank eines anderen Benutzers',
                            "es-ES": 'Ver el banco de otro usuario',
                            "fr": 'Afficher la banque d\'un autre utilisateur',
                            "it": 'Visualizza la banca di un altro utente',
                            "pt-BR": 'Visualizar o banco de outro usuário',
                            "ru": 'Просмотр банка другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("rank")
                .setDescription("⌠💸⌡ See the ranking of bourgeois")
                .setDescriptionLocalizations({
                    "de": '⌠💸⌡ Überprüfen Sie das Bankenranking',
                    "es-ES": '⌠💸⌡ Ver el ranking de burgués',
                    "fr": '⌠💸⌡ Voir le classement bourgeois',
                    "it": '⌠💸⌡ Vedi la classifica borghese',
                    "pt-BR": '⌠💸⌡ Veja o ranking de burgueses',
                    "ru": '⌠💸⌡ Посмотреть буржуйский рейтинг'
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
    menu_data: new ContextMenuCommandBuilder()
        .setName("Bank")
        .setNameLocalizations({
            "es-ES": 'Banco',
            "fr": 'Banque',
            "it": 'Banca',
            "pt-BR": 'Banco',
            "ru": 'банк'
        })
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require(`./subcommands/bank_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("./subcommands/bank_statement")({ client, user, interaction })
    }
}