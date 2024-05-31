const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Canal alvo para o bot enviar os relatórios de reportes
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== ChannelType.GuildText)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o reportador
        canal_alvo = interaction.options.getChannel("value")
        guild.reports.channel = canal_alvo.id
    }

    // Sem canal informado no comando e nenhum canal salvo no cache do bot
    if (!canal_alvo && !guild.reports.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {
        if (!guild.reports.channel) // Sem canal salvo em cache
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        if (typeof canal_alvo !== "object") // Restaurando o canal do cache
            canal_alvo = await client.channels().get(guild.reports.channel)

        if (!canal_alvo) { // Canal salvo em cache foi apagado
            guild.conf.reports = false
            await guild.save()

            return client.tls.reply(interaction, user, "mode.logger.canal_excluido", true, 1)
        }

        // Sem permissão para ver ou escrever no canal mencionado
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal_alvo))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Inverte o status de funcionamento apenas se executar o comando sem informar um canal
    if (!interaction.options.getChannel("value"))
        guild.conf.reports = !guild.conf.reports
    else
        guild.conf.reports = true

    // Se usado sem mencionar o canal, desliga os reportes no servidor
    if (!canal_alvo) guild.conf.reports = false

    await guild.save()

    if (guild.conf.reports)
        client.tls.reply(interaction, user, "mode.report.ativo", true, 15, `<#${guild.reports.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.report.desativo", true, 16)
}