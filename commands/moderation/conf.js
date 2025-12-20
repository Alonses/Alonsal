const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js')

const TAB_CHOICES = [
    { name: '📜 Event log', value: 'log' },
    { name: '💀 Death note', value: 'death_note' },
    { name: '📛 Anti-Spam', value: 'spam' },
    { name: '🛑 Warn', value: 'warn' },
    { name: '📻 External reports', value: 'report' },
    { name: '⌚ Timed roles', value: 'timed_roles' },
    { name: '💬 Tickets', value: 'ticket' },
    { name: '🔊 Voice channels', value: 'voice_channels' }
]

const LANGUAGE_CHOICES = [
    { name: '🏴 Alonsês', value: 'pt-al' },
    { name: '🇩🇪 Deutsch', value: 'de-de' },
    { name: '🇺🇸 English', value: 'en-us' },
    { name: '🇪🇸 Español', value: 'es-es' },
    { name: '🇫🇷 Français', value: 'fr-fr' },
    { name: '🔆 Hopês', value: 'pt-hp' },
    { name: '🇮🇹 Italiano', value: 'it-it' },
    { name: '🇧🇷 Português', value: 'pt-br' },
    { name: '🇷🇺 Русский', value: 'ru-ru' }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("conf")
        .setDescription("⌠💂⌡ Manage server settings")
        .addSubcommand(subcommand =>
            subcommand.setName("guild")
                .setDescription("⌠💂⌡ Server settings")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Server Einstellungen',
                    "es-ES": '⌠💂⌡ Configuración del servidor',
                    "fr": '⌠💂⌡ Paramètres du serveur',
                    "it": '⌠💂⌡ Impostazioni del server',
                    "pt-BR": '⌠💂⌡ Configurações do servidor',
                    "ru": '⌠💂⌡ Настройки сервера'
                })
                .addStringOption(option =>
                    option.setName("operation")
                        .setNameLocalizations({
                            "de": 'betrieb',
                            "es-ES": 'operacion',
                            "fr": 'operation',
                            "it": 'operazione',
                            "pt-BR": 'operacao',
                            "ru": 'операция'
                        })
                        .setDescription("Select an operation")
                        .setDescriptionLocalizations({
                            "de": 'Wählen Sie einen Vorgang aus',
                            "es-ES": 'Seleccione una operación',
                            "fr": 'Sélectionnez une opération',
                            "it": 'Seleziona un\'operazione',
                            "pt-BR": 'Escolha uma operação',
                            "ru": 'Выберите операцию'
                        })
                        .addChoices(...TAB_CHOICES)
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName("value")
                        .setNameLocalizations({
                            "de": 'wert',
                            "es-ES": 'valor',
                            "fr": 'valeur',
                            "it": 'valore',
                            "pt-BR": 'valor',
                            "ru": 'ценить'
                        })
                        .setDescription("The entry value")
                        .setDescriptionLocalizations({
                            "de": 'der Eingabewert',
                            "es-ES": 'El valor de entrada',
                            "fr": 'La valeur d\'entrée',
                            "it": 'Il valore di entrata',
                            "pt-BR": 'O valor de entrada',
                            "ru": 'значение входа'
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
                        .addChoices(...LANGUAGE_CHOICES)
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {

        const guild = await client.getGuild(interaction.guild.id)
        const funcao = interaction.options.getString("operation") || interaction.options.getSubcommand()

        // Solicitando a função e executando
        require(`./subcommands/conf_${funcao}`)({ client, user, interaction, guild })
    }
}