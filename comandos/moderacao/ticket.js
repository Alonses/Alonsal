const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(client, user, interaction) {

        const membro_sv = await client.getUserGuild(interaction, client.id())
        let categoria = null

        // Permissões para gerenciar canais e cargos necessária para a função de tickets
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
            return client.tls.reply(interaction, user, "mode.ticket.permissao", true, 3)

        // Categoria alvo para o bot criar os canais
        if (typeof interaction.options.data[0] !== "undefined") {
            categoria = interaction.options.getChannel("category").type

            // Mencionado um tipo de canal errado
            if (categoria !== 4)
                return client.tls.reply(interaction, user, "mode.ticket.tipo_canal", true, 0)
        }

        let guild = await client.getGuild(interaction.guild.id)

        // Ativa ou desativa o modo fantasma e salva
        guild.conf.tickets = !user.conf.tickets

        // Se usado sem mencionar categoria, desliga função
        if (categoria === null)
            guild.conf.tickets = false
        else
            guild.tickets.category = interaction.options.getChannel("category").id

        await guild.save()

        if (guild.conf.tickets)
            interaction.reply({ content: `:mailbox: | ${client.tls.phrase(user, "mode.ticket.ativo")}`, ephemeral: true })
        else
            interaction.reply({ content: `:mailbox_closed: | ${client.tls.phrase(user, "mode.ticket.desativo")}`, ephemeral: true })
    }
}