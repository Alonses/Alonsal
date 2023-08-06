const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bank")
        .setNameLocalizations({
            "pt-BR": 'banco',
            "es-ES": 'banco',
            "fr": 'banque',
            "it": 'banca',
            "ru": 'банк'
        })
        .setDescription("⌠💸⌡ See your Bufunfas")
        .addSubcommand(subcommand =>
            subcommand
                .setName("resumo")
                .setDescription("⌠💸⌡ See your Bufunfas")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
                    "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
                    "fr": '⌠💸⌡ Voir vos Bufunfas',
                    "it": '⌠💸⌡ Visualizza il tuo Bufunfa',
                    "ru": '⌠💸⌡ посмотреть свой Bufunfa'
                })
                .addUserOption(option =>
                    option.setName("user")
                        .setNameLocalizations({
                            "pt-BR": 'usuario',
                            "es-ES": 'usuario',
                            "fr": 'user',
                            "it": 'utente',
                            "ru": 'пользователь'
                        })
                        .setDescription("View another user\'s bank")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Visualizar o banco de outro usuário',
                            "es-ES": 'Ver el banco de otro usuario',
                            "fr": 'Afficher la banque d\'un autre utilisateur',
                            "it": 'Visualizza la banca di un altro utente',
                            "ru": 'Просмотр банка другого пользователя'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("rank")
                .setDescription("⌠💸⌡ See your Bufunfas")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💸⌡ Rank de burgueses'
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
    menu_data: new ContextMenuCommandBuilder()
        .setName("Bank")
        .setNameLocalizations({
            "pt-BR": 'Banco',
            "es-ES": 'Banco',
            "fr": 'Banque',
            "it": 'Banca',
            "ru": 'банк'
        })
        .setType(ApplicationCommandType.User),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require(`./subcommands/bank_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    },
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../../adm/formatadores/chunks/bank_resume")({ client, user, interaction })
    },
}