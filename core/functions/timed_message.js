const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, data }) => {

    const interaction = data.interaction
    const message = data.message
    const expires = data.expires

    const canal = await client.getGuildChannel(interaction.channel.id)
    if (!canal) return

    // Verificando se o bot possui permissões para enviar mensagens ou ver o canal
    if (!await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal })) return

    canal.send(message) // Envia a mensagem e apaga a mesma após um tempo
        .then(m => setTimeout(() => { m.delete().catch(() => console.error) }, (expires - 1) * 1000))
}