const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("channel").type !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o reportador
        canal_alvo = interaction.options.getChannel("channel").id
        guild.reports.channel = canal_alvo
    }

    // Sem canal informado no comando e nenhum canal salvo no banco do bot
    if (!canal_alvo && !guild.reports.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {
        if (!canal_alvo) // Sem canal informado
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        // Sem permissão para ver ou escrever no canal mencionado
        if (!canal_alvo.permissionsFor(client.id()).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Ativa ou desativa os reportes no servidor
    if (!guild.conf.reports)
        guild.conf.reports = false
    else
        guild.conf.reports = !guild.conf.reports

    // Se usado sem mencionar o canal, desliga os reportes no servidor
    if (!canal_alvo)
        guild.conf.reports = false

    await guild.save()

    if (guild.conf.reports)
        client.tls.reply(interaction, user, "mode.report.ativo", true, 15, `<#${guild.reports.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.report.desativo", true, 16)
}