const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setNameLocalizations({
            "fr": 'panneau',
            "it": 'pannello',
            "pt-BR": 'painel',
            "ru": 'панель'
        })
        .setDescription("⌠👤⌡ Control my functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("personal")
                .setNameLocalizations({
                    "de": 'personliches',
                    "fr": 'personnel',
                    "it": 'personnel',
                    "pt-BR": 'pessoal',
                    "ru": 'личная'
                })
                .setDescription("⌠👤⌡ Control my functions")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Kontrolliere meine Ressourcen',
                    "es-ES": '⌠👤⌡ Controlar mis funciones',
                    "fr": '⌠👤⌡ Contrôler mes fonctions',
                    "it": '⌠👤⌡ Controllare le mie funzioni',
                    "pt-BR": '⌠👤⌡ Controle minhas funções',
                    "ru": '⌠👤⌡ контролировать мои функции'
                })
                .addStringOption(option =>
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
                        .addChoices(
                            { name: '👻 Ghostmode, 🔔 DM notifications, 🏆 Ranking', value: '0' },
                            { name: '🕶 Public badges, 🌩 Weather summary, 🌐 Global tasks', value: '1' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("⌠💂⌡ Control my functions")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Kontrolliere meine Ressourcen',
                    "es-ES": '⌠💂⌡ Controlar mis funciones',
                    "fr": '⌠💂⌡ Contrôler mes fonctions',
                    "it": '⌠💂⌡ Controllare le mie funzioni',
                    "pt-BR": '⌠💂⌡ Controle minhas funções',
                    "ru": '⌠💂⌡ контролировать мои функции'
                })
                .addStringOption(option =>
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
                        .addChoices(
                            { name: '📜 Event log, 📛 Anti-Spam, 🎮 Free Games ad', value: '0' },
                            { name: '📡 Networking, 💂 External reports, 💂 In-server reports', value: '1' },
                            { name: '🗣 Talkative Alonsal, 📡 Broadcast, 🌐 Global visibility', value: '2' }
                        ))),
    async execute({ client, user, interaction }) {

        const operador = parseInt(interaction.options.getString("page")) || 0
        return require(`../../core/interactions/chunks/panel_${interaction.options.getSubcommand()}`)({ client, user, interaction, operador })
    }
}