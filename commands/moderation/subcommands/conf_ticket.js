const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== 4)
            return client.tls.reply(interaction, user, "mode.ticket.tipo_canal", true, client.defaultEmoji("types"))

        canal_alvo = interaction.options.getChannel("value").id
        guild.tickets.category = canal_alvo
    }

    // Sem categoria informada no comando e nenhuma categoria salva no cache do bot
    if (!canal_alvo && !guild.tickets.category)
        return client.tls.reply(interaction, user, "mode.ticket.sem_categoria", true, 1)
    else {
        if (!guild.tickets.category) // Sem categoria salva em cache
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        if (typeof canal_alvo !== "object") // Restaurando a categoria do cache
            canal_alvo = await client.channels().get(guild.tickets.category)

        if (!canal_alvo) { // Categoria salva em cache foi apagada
            guild.conf.tickets = false
            await guild.save()

            return client.tls.reply(interaction, user, "mode.logger.categoria_excluida", true, 1)
        }
    }

    // Inverte o status de funcionamento apenas se executar o comando sem informar uma categoria
    if (!interaction.options.getChannel("value"))
        guild.conf.tickets = !guild.conf.tickets
    else
        guild.conf.tickets = true

    // Se usado sem mencionar categoria, desliga os tickets de denuncia
    if (!canal_alvo)
        guild.conf.tickets = false

    // Verificando as permissões do bot
    const permissoes = await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])

    if (!permissoes) {
        guild.conf.tickets = false
        await guild.save()

        return client.reply(interaction, {
            content: client.tls.phrase(user, "manu.painel.salvo_sem_permissao", [10, 7]),
            ephemeral: true
        })
    }

    await guild.save()

    if (guild.conf.tickets)
        client.tls.reply(interaction, user, "mode.ticket.ativo", true, 31)
    else
        client.tls.reply(interaction, user, "mode.ticket.desativo", true, 16)
}