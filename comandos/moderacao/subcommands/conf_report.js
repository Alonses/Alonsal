
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
    if (!canal_alvo && typeof guild.reports.channel === "undefined")
        return interaction.reply({
            content: ":o: | Você não mencionou nenhum canal, e não possui um canal salvo em cache!\nPor favor, utilize o comando novamente mencionando um canal",
            ephemeral: true
        })

    // Ativa ou desativa os reportes no servidor
    if (typeof guild.conf.reports === "undefined")
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