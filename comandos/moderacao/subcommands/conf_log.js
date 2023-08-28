module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("channel").type !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o logger
        canal_alvo = interaction.options.getChannel("channel").id
        guild.logger.channel = canal_alvo
    }

    // Sem canal informado no comando e nenhum canal salvo no banco do bot
    if (!canal_alvo && typeof guild.logger.channel === "undefined")
        return interaction.reply({
            content: ":o: | Você não mencionou nenhum canal, e não possui um canal salvo em cache!\nPor favor, utilize o comando novamente mencionando um canal",
            ephemeral: true
        })

    // Ativa ou desativa o logger no servidor
    if (typeof guild.conf.logger === "undefined")
        guild.conf.logger = true
    else
        guild.conf.logger = !guild.conf.logger

    // Se usado sem mencionar um canal, desliga o logger
    if (!canal_alvo)
        guild.conf.logger = false

    await guild.save()

    if (guild.conf.logger)
        client.tls.reply(interaction, user, "mode.logger.ativado", true, client.defaultEmoji("guard"), `<#${guild.logger.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.logger.desativado", true, 11)
}