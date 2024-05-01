const { dropTicket } = require('../../../core/database/schemas/User_tickets')

module.exports = async ({ client, user, interaction, channel, solicitante, canal_servidor }) => {

    // Sem canal de denúncias ativo
    if (channel.cid === null)
        return client.tls.reply(interaction, user, "mode.denuncia.canal_fechado", true, 4)

    const date1 = new Date()

    client.tls.reply(interaction, user, "mode.denuncia.fechando_canal", true, 7, `<t:${Math.floor((date1.getTime() + 10000) / 1000)}:R>`)

    setTimeout(() => {
        canal_servidor.permissionOverwrites.edit(solicitante, { ViewChannel: false })

        // Apagando o ticket de denúncia do usuário
        dropTicket(interaction.guild.id, interaction.user.id)
        // canal_servidor.delete()
    }, 10000)
}