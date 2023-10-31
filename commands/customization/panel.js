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
                    option.setName("function")
                        .setNameLocalizations({
                            "de": 'funktion',
                            "es-ES": 'funcion',
                            "fr": 'fonction',
                            "it": 'funzione',
                            "pt-BR": 'funcao',
                            "ru": 'функция'
                        })
                        .setDescription("A function to configure")
                        .setDescriptionLocalizations({
                            "de": 'Eine Funktion zum Konfigurieren',
                            "es-ES": 'Una función para configurar',
                            "fr": 'Une fonction à configurer',
                            "it": 'Una funzione da configurare',
                            "pt-BR": 'Uma função para configurar',
                            "ru": 'Функция для настройки'
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
                    option.setName("function")
                        .setNameLocalizations({
                            "de": 'funktion',
                            "es-ES": 'funcion',
                            "fr": 'fonction',
                            "it": 'funzione',
                            "pt-BR": 'funcao',
                            "ru": 'функция'
                        })
                        .setDescription("A function to configure")
                        .setDescriptionLocalizations({
                            "de": 'Eine Funktion zum Konfigurieren',
                            "es-ES": 'Una función para configurar',
                            "fr": 'Une fonction à configurer',
                            "it": 'Una funzione da configurare',
                            "pt-BR": 'Uma função para configurar',
                            "ru": 'Функция для настройки'
                        })
                        .addChoices(
                            { name: '📜 Event log, 📛 Anti-Spam, 🎮 Free Games ad', value: '0' },
                            { name: '📡 Networking, 💂 External reports, 💂 In-server reports', value: '1' },
                            { name: '🗣 Talkative Alonsal, 📡 Broadcast, 🌐 Global visibility', value: '2' }
                        ))),
    async execute({ client, user, interaction }) {

        const operador = parseInt(interaction.options.getString("function")) || 0
        require(`../../core/interactions/chunks/panel_${interaction.options.getSubcommand()}`)({ client, user, interaction, operador })
    }
}