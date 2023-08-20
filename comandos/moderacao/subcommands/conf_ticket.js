const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Permissões para gerenciar canais e cargos necessária para a função de tickets
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return client.tls.reply(interaction, user, "mode.ticket.permissao", true, 3)

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("category")) {
        canal_alvo = interaction.options.getChannel("category").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 4)
            return client.tls.reply(interaction, user, "mode.ticket.tipo_canal", true, client.defaultEmoji("types"))
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
        client.tls.reply(interaction, user, "mode.ticket.ativo", true, 31)
    else
        client.tls.reply(interaction, user, "mode.ticket.desativo", true, 16)
}