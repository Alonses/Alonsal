const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

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

        if (interaction.options.getSubcommand() === "ticket") {
            const membro_sv = await client.getUserGuild(interaction, client.id())

            // Permissões para gerenciar canais e cargos necessária para a função de tickets
            if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
                return client.tls.reply(interaction, user, "mode.ticket.permissao", true, 3)

            // Categoria alvo para o bot criar os canais
            if (interaction.options.getChannel("category")) {
                canal_alvo = interaction.options.getChannel("category").type

                // Mencionado um tipo de canal errado
                if (canal_alvo !== 4)
                    return client.tls.reply(interaction, user, "mode.ticket.tipo_canal", true, 0)
            }

            // Ativa ou desativa os tickets no servidor
            guild.conf.tickets = !user.conf.tickets

            // Se usado sem mencionar categoria, desliga função
            if (canal_alvo === null)
                guild.conf.tickets = false
            else
                guild.tickets.category = interaction.options.getChannel("category").id

            await guild.save()

            if (guild.conf.tickets)
                interaction.reply({ content: `:mailbox: | ${client.tls.phrase(user, "mode.ticket.ativo")}`, ephemeral: true })
            else
                interaction.reply({ content: `:mailbox_closed: | ${client.tls.phrase(user, "mode.ticket.desativo")}`, ephemeral: true })
        } else if (interaction.options.getSubcommand() === "report") {

            // Categoria alvo para o bot criar os canais
            if (interaction.options.getChannel("channel")) {
                canal_alvo = interaction.options.getChannel("channel").type

                // Mencionado um tipo de canal errado
                if (canal_alvo !== 0)
                    return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, 0)
            }

            // Ativa ou desativa os tickets no servidor
            guild.conf.reports = !user.conf.reports

            // Se usado sem mencionar categoria, desliga função
            if (canal_alvo === null)
                guild.conf.reports = false
            else
                guild.reports.channel = interaction.options.getChannel("channel").id

            await guild.save()

            if (guild.conf.reports)
                interaction.reply({ content: client.replace(client.tls.phrase(user, "mode.report.ativo", 15), `<#${guild.reports.channel}>`), ephemeral: true })
            else
                interaction.reply({ content: client.tls.phrase(user, "mode.report.desativo", 16), ephemeral: true })

        } else {

            // Ativa ou desativa a visualização do servidor no ranking global
            guild.conf.public = !user.conf.public

            await guild.save()

            if (guild.conf.public)
                interaction.reply({ content: `${client.defaultEmoji("earth")} | O nome do servidor será mostrado no ranking global para todos os servidores agora!`, ephemeral: true })
            else
                interaction.reply({ content: `${client.defaultEmoji("detective")} | O servidor não será mais mostrado no ranking global.`, ephemeral: true })
        }
    }
}