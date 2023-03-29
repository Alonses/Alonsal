const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("denuncia")
        .setDescription("⌠💂⌡ Denuncie algo!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("abrir")
                .setDescription("⌠💂⌡ Inicie um chat de denúncia"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("fechar")
                .setDescription("⌠💂⌡ Encerre seu chat de denúncia")),
    async execute(client, user, interaction) {

        let guild = await client.getGuild(interaction.guild.id)

        // Verificando se as denúncias em canais privados estão ativas no servidor
        if (!guild.conf.tickets)
            return client.tls.reply(interaction, user, "mode.denuncia.desativado", true, 3)

        let channel = await client.getTicket(interaction.guild.id, interaction.user.id)
        let solicitante = await client.getUserGuild(interaction, interaction.user.id)

        // Buscando os dados do canal no servidor
        let canal_servidor = interaction.guild.channels.cache.find(c => c.id === channel.cid)

        if (interaction.options.getSubcommand() === "abrir") {

            // Verificando se o canal ativo existe no servidor
            let verificacao = interaction.guild.channels.cache.find(c => c.id === channel.cid) || 404

            if (verificacao === 404)
                channel.cid = null

            // Re-exibindo o canal já existente ao usuário
            if (channel.cid !== null) {
                canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: true })

                return interaction.reply({ content: `Você já possui um canal de denúncia aberto! ( <#${channel.cid}> )`, ephemeral: true })
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
                .catch(() => interaction.reply({ content: "Houve um erro e não foi possível criar o canal no momento, por favor, tente novamente mais tarde", ephemeral: true }))
        } else {
            // Sem canal de denúncias ativo
            if (channel.cid === null)
                return interaction.reply({ content: "Você não possui um canal de denúncia aberto! ", ephemeral: true })

            const date1 = new Date()

            const msg = await interaction.reply({ content: `Este canal será fechado <t:${Math.floor((date1.getTime() + 10000) / 1000)}:R> segundos, obrigado!`, ephemeral: true })

            setTimeout(() => {
                canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: false })

                try {
                    msg.delete()
                } catch (e) {
                    console.log(e)
                }

                // Apagando o ticket de denúncia do usuário
                client.dropTicket(interaction.guild.id, interaction.user.id)
                // canal_servidor.delete()
            }, 10000)
        }
    }
}