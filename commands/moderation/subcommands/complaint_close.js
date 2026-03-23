const { getTicket } = require('../../../core/database/schemas/User_tickets')

module.exports = async ({ client, user, interaction }) => {

    const channel = await getTicket(client.encrypt(interaction.guild.id), client.encrypt(interaction.user.id))

    // Sem canal de denúncias ativo
    if (channel.cid === null) return client.tls.reply(interaction, user, "mode.denuncia.canal_fechado", true, 4)

    const row = client.create_buttons([
        { id: "complaints", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `6|${client.decifer(channel.cid)}.${interaction.guild.id}` },
        { id: "complaints", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `7|0.0` }
    ], interaction, user)

    client.reply(interaction, { content: client.tls.phrase(user, "mode.denuncia.confirma_exclusao", 8), components: [row], flags: "Ephemeral" })
}