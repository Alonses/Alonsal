const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("conf")
        .setDescription("⌠💂⌡ Gerencie funcões do servidor")
        .addSubcommand(subcommand =>
            subcommand.setName("ticket")
                .setDescription("⌠💂⌡ (Des)Ative as denúncias em canais privados no servidor")
                .addChannelOption(option =>
                    option.setName("category")
                        .setNameLocalizations({
                            "pt-BR": 'categoria',
                            "es-ES": 'categoria',
                            "fr": 'categorie',
                            "it": 'categoria',
                            "ru": 'категория'
                        })
                        .setDescription("Mention a category as a target")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque uma categoria como alvo',
                            "es-ES": 'Menciona una categoría como objetivo',
                            "fr": 'Mentionner une catégorie comme cible',
                            "it": 'Indica una categoria come obiettivo',
                            "ru": 'Упоминание категории в качестве цели'
                        }))
        )
        .addSubcommand(subcommand =>
            subcommand.setName("report")
                .setDescription("⌠💂⌡ (Des)Ative os reports de usuários externos no servidor")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setNameLocalizations({
                            "pt-BR": 'canal',
                            "es-ES": 'canal',
                            "fr": 'chaîne',
                            "it": 'canale',
                            "ru": 'канал'
                        })
                        .setDescription("Mention a channel")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Marque um canal como alvo',
                            "es-ES": 'Mencionar un canal como objetivo',
                            "fr": 'Mentionner une chaîne',
                            "it": 'Menzionare un canale',
                            "ru": 'упомянуть канал'
                        })))
        .addSubcommand(subcommand =>
            subcommand.setName("ranking")
                .setDescription("⌠💂⌡ (Des)Ative a exibição do servidor no ranking global"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(client, user, interaction) {

        let canal_alvo = null
        const guild = await client.getGuild(interaction.guild.id)

        // Solicitando a função e executando
        require(`./subcommands/conf_${interaction.options.getSubcommand()}`)({ client, user, interaction, guild, canal_alvo })
    }
}