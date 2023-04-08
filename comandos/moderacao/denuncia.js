const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("complaint")
        .setNameLocalizations({
            "pt-BR": 'denuncia',
            "es-ES": 'queja',
            "fr": 'plainte',
            "it": 'rimostranza',
            "ru": 'жалоба'
        })
        .setDescription("⌠💂⌡ Report something!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("start")
                .setNameLocalizations({
                    "pt-BR": 'iniciar',
                    "es-ES": 'comenzar',
                    "fr": 'commencer',
                    "it": 'iniziare',
                    "ru": 'начать'
                })
                .setDescription("⌠💂⌡ Inicie um chat de denúncia")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Inicie um chat de denúncia',
                    "es-ES": '⌠💂⌡ Iniciar un chat de informe',
                    "fr": '⌠💂⌡ Démarrer un canal de signalement',
                    "it": '⌠💂⌡ Avvia una chat di report',
                    "ru": '⌠💂⌡ Начать канал жалоб'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("close")
                .setNameLocalizations({
                    "pt-BR": 'fechar',
                    "es-ES": 'cerrar',
                    "fr": 'fermer',
                    "it": 'chiudere',
                    "ru": 'закрывать'
                })
                .setDescription("⌠💂⌡ Encerre seu chat de denúncia")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Encerre seu chat de denúncia',
                    "es-ES": '⌠💂⌡ Termina tu chat de informe',
                    "fr": '⌠💂⌡ Terminer le chat de signalement',
                    "it": '⌠💂⌡ Termina la chat di segnalazione',
                    "ru": '⌠💂⌡ Закрыть чат жалоб'
                })),
    async execute(client, user, interaction) {

        let guild = await client.getGuild(interaction.guild.id)

        // Verificando se as denúncias em canais privados estão ativas no servidor
        if (!guild.conf.tickets)
            return client.tls.reply(interaction, user, "mode.denuncia.desativado", true, 3)

        let channel = await client.getTicket(interaction.guild.id, interaction.user.id)
        let solicitante = await client.getUserGuild(interaction, interaction.user.id)

        // Buscando os dados do canal no servidor
        let canal_servidor = interaction.guild.channels.cache.find(c => c.id === channel.cid)

        if (interaction.options.getSubcommand() === "start") {

            // Verificando se o canal ativo existe no servidor
            let verificacao = interaction.guild.channels.cache.find(c => c.id === channel.cid) || 404

            if (verificacao === 404)
                channel.cid = null

            // Re-exibindo o canal já existente ao usuário
            if (channel.cid !== null) {
                canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: true })

                return interaction.reply({ content: `${client.tls.phrase(user, "mode.denuncia.canal_aberto")} ( <#${channel.cid}> )`, ephemeral: true })
            }

            let everyone = interaction.guild.roles.cache.find(r => r.name === '@everyone');
            let bot = await client.getUserGuild(interaction, client.id()) // Liberando ao canal para o bot

            // Criando o canal e atribuindo ele aos usuários especificos/ categoria escolhida
            interaction.guild.channels.create({
                name: interaction.user.username,
                type: ChannelType.GuildText,
                parent: guild.tickets.category,
                permissionOverwrites: [
                    {
                        id: everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: solicitante,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: bot,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    }
                ],
            })
                .then(async new_channel => {
                    interaction.reply({ content: `${client.tls.phrase(user, "mode.denuncia.introducao").replace("chat_repl", new_channel)}`, ephemeral: true })

                    channel.cid = new_channel.id

                    await channel.save()
                })
                .catch(() => client.tls.reply(interaction, user, "mode.denuncia.erro_1", true, 4))
        } else {
            // Sem canal de denúncias ativo
            if (channel.cid === null)
                return client.tls.reply(interaction, user, "mode.denuncia.canal_fechado", true, 4)

            const date1 = new Date()

            const msg = await interaction.reply({ content: `${client.tls.phrase(user, "mode.denuncia.fechando_canal").replace("tempo_repl", `<t:${Math.floor((date1.getTime() + 10000) / 1000)}:R>`)}`, ephemeral: true })

            setTimeout(() => {
                canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: false })
                msg.delete()

                // Apagando o ticket de denúncia do usuário
                client.dropTicket(interaction.guild.id, interaction.user.id)
                // canal_servidor.delete()
            }, 10000)
        }
    }
}