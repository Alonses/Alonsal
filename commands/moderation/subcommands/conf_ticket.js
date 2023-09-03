const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let canal_alvo

    // Permissões para gerenciar canais e cargos necessária para a função de tickets
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return client.tls.reply(interaction, user, "mode.ticket.permissao", true, 3)

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("category")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("category").type !== 4)
            return client.tls.reply(interaction, user, "mode.ticket.tipo_canal", true, client.defaultEmoji("types"))

        canal_alvo = interaction.options.getChannel("category").id
        guild.tickets.category = canal_alvo
    }

    // Sem canal informado no comando e nenhum canal salvo no banco do bot
    if (!canal_alvo && !guild.tickets.category)
        return client.tls.reply(interaction, user, "mode.ticket.sem_categoria", true, 1)

    // Ativa ou desativa os tickets de denúncia no servidor
    if (!guild.conf.tickets)
        guild.conf.tickets = true
    else
        guild.conf.tickets = !guild.conf.tickets

    // Se usado sem mencionar categoria, desliga os tickets de denuncia
    if (!canal_alvo)
        guild.conf.tickets = false

    await guild.save()

    if (guild.conf.tickets)
        client.tls.reply(interaction, user, "mode.ticket.ativo", true, 31)
    else
        client.tls.reply(interaction, user, "mode.ticket.desativo", true, 16)
}