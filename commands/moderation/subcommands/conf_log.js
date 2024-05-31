const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Canal alvo para o bot enviar os logs de eventos
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== ChannelType.GuildText)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo o canal passado para o logger
        canal_alvo = interaction.options.getChannel("value")
        guild.logger.channel = canal_alvo.id
    }

    // Sem canal informado no comando e nenhum canal salvo no cache do bot
    if (!canal_alvo && !guild.logger.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {
        if (!guild.logger.channel) // Sem canal salvo em cache
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        if (typeof canal_alvo !== "object") // Restaurando o canal do cache
            canal_alvo = await client.channels().get(guild.logger.channel)

        if (!canal_alvo) { // Canal salvo em cache foi apagado
            guild.conf.logger = false
            await guild.save()

            return client.tls.reply(interaction, user, "mode.logger.canal_excluido", true, 1)
        }

        // Sem permissão para ver ou escrever no canal mencionado
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal_alvo))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Ativa ou desativa o logger no servidor
    if (!guild.conf.logger) guild.conf.logger = true
    else {
        // Inverte o status de funcionamento apenas se executar o comando sem informar um canal
        if (!interaction.options.getChannel("value"))
            guild.conf.logger = !guild.conf.logger
        else
            guild.conf.logger = true
    }

    // Se usado sem mencionar um canal, desliga o logger
    if (!canal_alvo) guild.conf.logger = false

    // Verificando as permissões do bot
    if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ViewAuditLog])) {
        guild.conf.logger = false
        await guild.save()

        return client.reply(interaction, {
            content: client.tls.phrase(user, "manu.painel.salvo_sem_permissao", [10, 7]),
            ephemeral: true
        })
    }

    await guild.save()

    if (guild.conf.logger)
        client.tls.reply(interaction, user, "mode.logger.ativado", true, client.defaultEmoji("guard"), `<#${guild.logger.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.logger.desativado", true, 11)
}