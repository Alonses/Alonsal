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
                            { name: '🗣 Talkative Alonsal, 📡 Broadcast, 🎮 Free Games ad', value: '0' },
                            { name: '💂 In-server reports, 💂 External reports, 📜 Event log', value: '1' },
                            { name: '📛 Anti-Spam, 🌐 Global visibility, 💂 AutoBan', value: '2' }
                        ))),
    async execute(client, user, interaction) {

        let pagina = parseInt(interaction.options.getString("page")) || 0

        if (interaction.options.getSubcommand() === "personal")
            return require('../../core/formatters/chunks/model_user_panel')(client, user, interaction, pagina)
        else
            return require('../../core/formatters/chunks/model_guild_panel')(client, user, interaction, pagina)
    }
}