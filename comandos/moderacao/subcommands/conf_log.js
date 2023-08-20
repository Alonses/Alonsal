module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.emoji(0))
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
        client.tls.reply(interaction, user, "mode.logger.ativado", true, client.defaultEmoji("guard"), `<#${guild.logger.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.logger.desativado", true, 11)
}