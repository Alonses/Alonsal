
module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, 0)
    }

    // Ativa ou desativa os tickets no servidor
    guild.conf.reports = !user.conf.reports

    // Se usado sem mencionar categoria, desliga função
    if (canal_alvo === null)
        guild.conf.reports = false
    else
        guild.reports.channel = interaction.options.getChannel("channel").id

    await guild.save()

    if (guild.conf.reports)
        interaction.reply({ content: client.replace(client.tls.phrase(user, "mode.report.ativo", 15), `<#${guild.reports.channel}>`), ephemeral: true })
    else
        interaction.reply({ content: client.tls.phrase(user, "mode.report.desativo", 16), ephemeral: true })
}