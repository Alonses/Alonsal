const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, channel, solicitante, canal_servidor }) => {

    // Verificando se o canal ativo existe no servidor
    let verificacao = interaction.guild.channels.cache.find(c => c.id === channel.cid) || 404

    if (verificacao === 404)
        channel.cid = null

    // Re-exibindo o canal já existente ao usuário
    if (channel.cid !== null) {
        canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: true })

        return interaction.reply({
            content: `${client.tls.phrase(user, "mode.denuncia.canal_aberto")} ( <#${channel.cid}> )`,
            ephemeral: true
        })
    }

    const everyone = interaction.guild.roles.cache.find(r => r.name === '@everyone')
    const bot = await client.getUserGuild(interaction, client.id()) // Liberando ao canal para o bot
    const guild = await client.getGuild(interaction.guild.id)

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
        ]
    })
        .then(async new_channel => {
            client.tls.reply(interaction, user, "mode.denuncia.introducao", true, 7, new_channel.id)

            channel.cid = new_channel.id
            await channel.save()
        })
        .catch(() => client.tls.reply(interaction, user, "mode.denuncia.erro_1", true, 4))
}