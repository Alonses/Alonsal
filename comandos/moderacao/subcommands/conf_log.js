module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, 0)
    }

    // Ativa ou desativa o logger no servidor
    if (typeof guild.conf.logger === "undefined")
        guild.conf.logger = true
    else
        guild.conf.logger = !user.conf.logger

    // Se usado sem mencionar um canal, desliga função
    if (canal_alvo === null)
        guild.conf.logger = false
    else
        guild.logger.channel = interaction.options.getChannel("channel").id

    await guild.save()

    if (guild.conf.logger)
        interaction.reply({ content: client.replace(client.tls.phrase(user, "mode.report.ativo", 15), `<#${guild.logger.channel}>`), ephemeral: true })
    else
        interaction.reply({ content: client.tls.phrase(user, "mode.report.desativo", 16), ephemeral: true })
}