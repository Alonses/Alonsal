const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js')

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
                .setDescription("⌠💂⌡ Add a suspicious link")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Fügen Sie einen verdächtigen Link hinzu',
                    "es-ES": '⌠💂⌡ Añadir un enlace sospechoso',
                    "fr": '⌠💂⌡ Ajouter un lien suspect',
                    "it": '⌠💂⌡ Aggiungi un collegamento sospetto',
                    "pt-BR": '⌠💂⌡ Adicionar um link suspeito',
                    "ru": '⌠💂⌡ Добавить подозрительную ссылку'
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
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("browse")
                .setNameLocalizations({
                    "de": 'sehen',
                    "es-ES": 'navegar',
                    "fr": 'voir',
                    "it": 'navigare',
                    "pt-BR": "navegar",
                    "ru": 'просматривать'
                })
                .setDescription("⌠💂⌡ Browse suspicious links saved on the server")
                .setDescriptionLocalizations({
                    "de": '⌠💂⌡ Durchsuchen Sie verdächtige Links, die auf dem Server gespeichert sind',
                    "es-ES": '⌠💂⌡ Explorar enlaces sospechosos guardados en el servidor',
                    "fr": '⌠💂⌡ Parcourir les liens suspects enregistrés sur le serveur',
                    "it": '⌠💂⌡ Esplora i link sospetti salvati sul server',
                    "pt-BR": '⌠💂⌡ Navegue pelos links suspeitos salvos no servidor',
                    "ru": '⌠💂⌡ Просмотрите подозрительные ссылки, сохраненные на сервере.'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {

        // Solicitando a função e executando
        require(`./subcommands/link_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}