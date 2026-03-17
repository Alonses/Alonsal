const { dropTicket } = require('../../../core/database/schemas/User_tickets')

module.exports = async ({ client, user, interaction, channel, canal_servidor }) => {

    // Sem canal de denúncias ativo
    if (channel.cid === null)
        return client.tls.reply(interaction, user, "mode.denuncia.canal_fechado", true, 4)

    client.tls.reply(interaction, user, "mode.denuncia.fechando_canal", true, 7, `<t:${Math.floor((new Date().getTime() + 10000) / 1000)}:R>`)
    const guild = await client.getGuild(interaction.guild.id)

    setTimeout(() => {
        canal_servidor.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false })

        // Apagando o ticket de denúncia do usuário
        dropTicket(client.encrypt(interaction.guild.id), client.encrypt(interaction.user.id))

        setTimeout(() => {
            const row = client.create_buttons([{ id: "complaints", name: { tls: "manu.guild_data.remover_canal" }, type: 3, emoji: client.emoji(13), data: `0|${canal_servidor.id}.${interaction.guild.id}` }], interaction, user)

            // Notificando no canal para os moderadores
            client.execute("notify", { id_canal: canal_servidor.id, conteudo: { content: client.tls.phrase(guild, "mode.denuncia.canal_encerrado", 76, [interaction.user.username, interaction.user.id, interaction.user.id, client.execute("timestamp")]), components: [row] } })
        }, 2000)
    }, 10000)
}