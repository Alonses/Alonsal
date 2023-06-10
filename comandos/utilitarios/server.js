const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("⌠💡⌡ Show server information")
        .addSubcommand(subcommand =>
            subcommand
                .setName("icon")
                .setDescription("⌠💡⌡ The server icon")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ O Icone do servidor',
                    "es-ES": '⌠💡⌡ El icono del servidor',
                    "fr": '⌠💡⌡ L\'icône du serveur',
                    "it": '⌠💡⌡ L\'icona del server',
                    "ru": '⌠💡⌡ Значок сервера'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("⌠💡⌡ Server information")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Informações do servidor',
                    "es-ES": '⌠💡⌡ Información del servidor',
                    "fr": '⌠💡⌡ Informations sur le serveur',
                    "it": '⌠💡⌡ Informazioni sul server',
                    "ru": '⌠💡⌡ Информация о сервере'
                })),
    async execute(client, user, interaction) {

        // Solicitando a função e executando
        require(`./subcommands/server_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}