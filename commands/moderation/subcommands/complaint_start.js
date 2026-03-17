const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, channel, canal_servidor }) => {

    // Verificando se o canal ativo existe no servidor
    let verificacao = interaction.guild.channels.cache.find(c => c.id === client.decifer(channel.cid)) || 404

    // Canal de denúncia desconhecido
    if (verificacao === 404) channel.cid = null

    if (channel.cid !== null) { // Re-exibindo o canal já existente ao usuário
        canal_servidor.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true })

        return client.tls.reply(interaction, user, "mode.denuncia.canal_aberto", true, 48, client.decifer(channel.cid))
    }

    const guild = await client.getGuild(interaction.guild.id)

    // Criando o canal e atribuindo ele aos usuários especificos/ categoria escolhida
    interaction.guild.channels.create({
        name: `💂‍♂️│${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: client.decifer(guild.tickets.category),
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: client.id(),
                allow: [PermissionsBitField.Flags.ViewChannel]
            }
        ]
    }).then(async new_channel => {
        client.tls.reply(interaction, user, "mode.denuncia.introducao", true, 7, new_channel.id)

        // Notificando o usuário no novo canal de denúncias
        channel.cid = client.encrypt(new_channel.id)
        channel.save()

        return client.execute("notify", { id_canal: new_channel.id, conteudo: { content: client.tls.phrase(user, "mode.denuncia.canal_iniciado", 25, interaction.user.id) } })
    }).catch(() => client.tls.reply(interaction, user, "mode.denuncia.erro_1", true, 4))
}