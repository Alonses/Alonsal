const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("conf")
        .setDescription("⌠💂⌡ Manage server roles")
        .addSubcommand(subcommand =>
            subcommand.setName("ticket")
                .setDescription("⌠💂⌡ Configure reports in private channels on the server")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie Berichte in privaten Kanälen auf dem Server',
                    "es-ES": '⌠💂⌡ Configurar informes en canales privados en el servidor',
                    "fr": '⌠💂⌡ Configurer les rapports dans les canaux privés sur le serveur',
                    "it": '⌠💂⌡ Configura i report nei canali privati sul server',
                    "pt-BR": '⌠💂⌡ Configure denúncias em canais privados no servidor',
                    "ru": '⌠💂⌡ Включить отчеты в частных каналах на сервере'
                })
                .addChannelOption(option =>
                    option.setName("category")
                        .setNameLocalizations({
                            "de": 'kategorie',
                            "es-ES": 'categoria',
                            "fr": 'categorie',
                            "it": 'categoria',
                            "pt-BR": 'categoria',
                            "ru": 'категория'
                        })
                        .setDescription("Mention a category")
                        .setDescriptionLocalizations({
                            "de": 'Erwähnen Sie eine Kategorie',
                            "es-ES": 'Menciona una categoría',
                            "fr": 'Mentionner une catégorie',
                            "it": 'Indica una categoria',
                            "pt-BR": 'Mencione uma categoria',
                            "ru": 'Введите категорию'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("report")
                .setDescription("⌠💂⌡ Configure external user reports on the server")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie externe Benutzerberichte auf dem Server',
                    "es-ES": '⌠💂⌡ Configurar informes de usuarios externos en el servidor',
                    "fr": '⌠💂⌡ Configurer les rapports des utilisateurs externes sur le serveur',
                    "it": '⌠💂⌡ Configurare i report degli utenti esterni sul server',
                    "pt-BR": '⌠💂⌡ Configure os reports de usuários externos no servidor',
                    "ru": '⌠💂⌡ Включить внешние отчеты пользователей на сервере'
                })
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "de": 'kanal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "pt-BR": 'canal',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "de": 'einen Kanal erwähnen',
                            "es-ES": 'Mencionar un canal',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "pt-BR": 'Mencione um canal',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("log")
                .setDescription("⌠💂⌡ Configure server event logging")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie die Serverprotokollierung',
                    "es-ES": '⌠💂⌡ Configurar el registro de eventos del servidor',
                    "fr": '⌠💂⌡ Configurer la journalisation des événements du serveur',
                    "it": '⌠💂⌡ Configurare la registrazione degli eventi del server',
                    "pt-BR": '⌠💂⌡ Configure o Log de eventos do servidor',
                    "ru": '⌠💂⌡ Настроить ведение журнала событий сервера'
                })
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "de": 'kanal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "pt-BR": 'canal',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "de": 'einen Kanal erwähnen',
                            "es-ES": 'Mencionar un canal',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "pt-BR": 'Mencione um canal',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("spam")
                .setDescription("⌠💂⌡ Configure the antispam module")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie das Antispam-Modul',
                    "es-ES": '⌠💂⌡ Configurar el módulo antispam',
                    "fr": '⌠💂⌡ Configurer le module anti-spam',
                    "it": '⌠💂⌡ Configura il modulo antispam',
                    "pt-BR": '⌠💂⌡ Configurar o módulo anti-spam',
                    "ru": '⌠💂⌡ Настройте модуль антиспама'
                })
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "de": 'kanal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "pt-BR": 'canal',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "de": 'einen Kanal erwähnen',
                            "es-ES": 'Mencionar un canal',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "pt-BR": 'Mencione um canal',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("language")
                .setDescription("⌠💂⌡ Configure server language")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie die Serversprache',
                    "es-ES": '⌠💂⌡ Establecer idioma del servidor',
                    "fr": '⌠💂⌡ Configurer la langue du serveur',
                    "it": '⌠💂⌡ Configura la lingua del server',
                    "pt-BR": '⌠💂⌡ Configure o idioma do servidor',
                    "ru": '⌠💂⌡ Установите язык сервера'
                })
                .addStringOption(option =>
                    option.setName("language")
                        .setNameLocalizations({
                            "de": 'sprache',
                            "es-ES": 'idioma',
                            "fr": 'langue',
                            "it": 'linguaggio',
                            "pt-BR": 'idioma',
                            "ru": 'язык'
                        })
                        .setDescription("The language to be used")
                        .setDescriptionLocalizations({
                            "de": 'Die zu verwendende Sprache',
                            "es-ES": 'El lenguaje a utilizar',
                            "fr": 'La langue à utiliser',
                            "it": 'La lingua da usare',
                            "pt-BR": 'O idioma que será utilizado',
                            "ru": 'Язык, который будет использоваться'
                        })
                        .addChoices(
                            { name: '🏴 Alonsês', value: 'al-br' },
                            { name: '🇩🇪 Deutsch', value: 'de-de' },
                            { name: '🇺🇸 English', value: 'en-us' },
                            { name: '🇪🇸 Español', value: 'es-es' },
                            { name: '🇫🇷 Français', value: 'fr-fr' },
                            { name: '🇮🇹 Italiano', value: 'it-it' },
                            { name: '🇧🇷 Português', value: 'pt-br' },
                            { name: '🇷🇺 Русский', value: 'ru-ru' }
                        )
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, user, interaction) {

        const guild = await client.getGuild(interaction.guild.id)

        // Solicitando a função e executando
        require(`./subcommands/conf_${interaction.options.getSubcommand()}`)({ client, user, interaction, guild })
    }
}