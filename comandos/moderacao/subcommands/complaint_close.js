const { dropTicket } = require('../../../adm/database/schemas/Tickets')

module.exports = async ({ client, user, interaction, channel, solicitante, canal_servidor }) => {

    // Sem canal de denúncias ativo
    if (channel.cid === null)
        return client.tls.reply(interaction, user, "mode.denuncia.canal_fechado", true, 4)

    const date1 = new Date()

    const msg = await interaction.reply({ content: client.replace(client.tls.phrase(user, "mode.denuncia.fechando_canal"), `<t:${Math.floor((date1.getTime() + 10000) / 1000)}:R>`), ephemeral: true })

    setTimeout(() => {
        canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: false })
        msg.delete()

        // Apagando o ticket de denúncia do usuário
        dropTicket(interaction.guild.id, interaction.user.id)
        // canal_servidor.delete()
    }, 10000)
}