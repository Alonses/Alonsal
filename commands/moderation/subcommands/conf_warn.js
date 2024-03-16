const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Canal de texto para enviar os relatórios de warns
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== ChannelType.GuildText)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o warn
        canal_alvo = interaction.options.getChannel("value")
        guild.warn.channel = canal_alvo.id
    }

    // Sem canal informado no comando e nenhum canal salvo no cache do bot
    if (!canal_alvo && !guild.warn.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {
        if (!guild.warn.channel) // Sem canal salvo em cache
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        if (typeof canal_alvo !== "object") // Restaurando o canal do cache
            canal_alvo = await client.channels().get(guild.warn.channel)

        if (!canal_alvo) { // Canal salvo em cache foi apagado
            guild.conf.warn = false
            await guild.save()

            return client.tls.reply(interaction, user, "mode.logger.canal_excluido", true, 1)
        }

        // Sem permissão para ver ou escrever no canal mencionado
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal_alvo))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Inverte o status de funcionamento apenas se executar o comando sem informar um canal
    if (!interaction.options.getChannel("value"))
        guild.conf.warn = !guild.conf.warn
    else
        guild.conf.warn = true

    // Se usado sem mencionar categoria, desliga o sistema de warns
    if (!canal_alvo)
        guild.conf.warn = false

    await guild.save()

    if (guild.conf.warn)
        client.tls.reply(interaction, user, "mode.warn.recurso_ativo", true, 10)
    else
        client.tls.reply(interaction, user, "mode.warn.recurso_desligado", true, client.emoji(0))
}