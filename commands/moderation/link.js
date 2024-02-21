const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("⌠💂⌡ Manage server spam links")
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setNameLocalizations({
                    "de": 'hinzufügen',
                    "es-ES": 'agregar',
                    "fr": 'ajouter',
                    "it": 'aggiungere',
                    "pt-BR": 'adicionar',
                    "ru": 'добавить'
                })
                .setDescription("⌠💂⌡ Server settings")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Server Einstellungen',
                    "es-ES": '⌠💂⌡ Configuración del servidor',
                    "fr": '⌠💂⌡ Paramètres du serveur',
                    "it": '⌠💂⌡ Impostazioni del server',
                    "pt-BR": '⌠💂⌡ Adicionar um link suspeito',
                    "ru": '⌠💂⌡ Настройки сервера'
                })
                .addStringOption(option =>
                    option.setName("link")
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
            subcommand.setName("browse")
                .setNameLocalizations({
                    "pt-BR": 'navegar'
                })
                .setDescription("⌠💂⌡ Configure server language")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Konfigurieren Sie die Serversprache',
                    "es-ES": '⌠💂⌡ Establecer idioma del servidor',
                    "fr": '⌠💂⌡ Configurer la langue du serveur',
                    "it": '⌠💂⌡ Configura la lingua del server',
                    "pt-BR": '⌠💂⌡ Configure o idioma do servidor',
                    "ru": '⌠💂⌡ Установите язык сервера'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute({ client, user, interaction }) {

        // Solicitando a função e executando
        require(`./subcommands/link_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}