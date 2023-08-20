
module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.emoji(0))
    }

    // Ativa ou desativa os tickets no servidor
    guild.conf.spam = !guild.conf.spam

    // Se usado sem mencionar categoria, desliga função
    if (canal_alvo === null)
        guild.conf.spam = false
    else
        guild.logger.channel = interaction.options.getChannel("channel").id

    await guild.save()

    if (guild.conf.spam)
        client.tls.reply(interaction, user, "mode.spam.ativado", true, client.defaultEmoji("guard"), [`<#${guild.logger.channel}>`, client.emoji("epic_embed_fail2")])
    else
        client.tls.reply(interaction, user, "mode.spam.desativado", true, client.defaultEmoji("guard"))
}