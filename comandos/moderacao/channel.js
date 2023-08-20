const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("⌠💂⌡ Manage the channel for other users!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("lock")
                .setNameLocalizations({
                    "pt-BR": 'bloquear',
                    "es-ES": 'bloquear',
                    "fr": 'bloc',
                    "it": 'bloccare',
                    "ru": 'закрывать'
                })
                .setDescription("⌠💂⌡ Block current channel")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Bloqueie o canal atual',
                    "es-ES": '⌠💂⌡ Bloquear el canal actual',
                    "fr": '⌠💂⌡ Verrouiller la chaîne actuelle',
                    "it": '⌠💂⌡ Blocca il canale corrente',
                    "ru": '⌠💂⌡ заблокировать текущий канал'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("unlock")
                .setNameLocalizations({
                    "pt-BR": 'desbloquear',
                    "es-ES": 'desbloquear',
                    "fr": 'ouvrir',
                    "it": 'aprire',
                    "ru": 'разблокировать'
                })
                .setDescription("⌠💂⌡ Unlock the current channel")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Desbloqueie o canal atual',
                    "es-ES": '⌠💂⌡ Desbloquear el canal actual',
                    "fr": '⌠💂⌡ Déverrouiller la chaîne actuelle',
                    "it": '⌠💂⌡ Sbloccare il canale corrente',
                    "ru": '⌠💂⌡ разблокировать текущий канал'
                }))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, user, interaction) {

        const membro_sv = await client.getUserGuild(interaction, client.id())

        // Permissões para gerenciar canais e cargos necessária para a função de tickets
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) || !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
            return client.tls.reply(interaction, user, "mode.ticket.permissao", true, 3)

        const channel = await client.discord.channels.cache.get(interaction.channel.id)

        // Solicitando a função e executando
        require(`./subcommands/channel_${interaction.options.getSubcommand()}`)({ client, user, interaction, channel })
    }
}