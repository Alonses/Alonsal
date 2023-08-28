
module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("channel").type !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        canal_alvo = interaction.options.getChannel("channel").id
        guild.logger.channel = canal_alvo
    }

    // Sem canal informado no comando e nenhum canal salvo no banco do bot
    if (!canal_alvo && typeof guild.logger.channel === "undefined")
        return interaction.reply({
            content: ":o: | Você não mencionou nenhum canal, e não possui um canal salvo em cache!\nPor favor, utilize o comando novamente mencionando um canal",
            ephemeral: true
        })

    // Ativa ou desativa o sistema antispam no servidor
    if (typeof guild.conf.spam === "undefined")
        guild.conf.spam = true
    else
        guild.conf.spam = !guild.conf.spam

    // Se usado sem mencionar categoria, desliga o sistema antispam
    if (!canal_alvo)
        guild.conf.spam = false

    await guild.save()

    if (guild.conf.spam)
        client.tls.reply(interaction, user, "mode.spam.ativado", true, client.defaultEmoji("guard"), [`<#${guild.logger.channel}>`, client.emoji("epic_embed_fail2")])
    else
        client.tls.reply(interaction, user, "mode.spam.desativado", true, client.defaultEmoji("guard"))
}