const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("channel").type !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o antispam
        canal_alvo = interaction.options.getChannel("channel")
        guild.logger.channel = canal_alvo.id
    }

    // Sem canal informado no comando e nenhum canal salvo no banco do bot
    if (!canal_alvo && !guild.logger.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else // Sem permissão para ver ou escrever no canal mencionado
        if (!canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.ViewChannel) || !canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.SendMessages))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)

    // Ativa ou desativa o sistema antispam no servidor
    if (!guild.conf.spam)
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