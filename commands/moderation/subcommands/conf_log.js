const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, guild }) => {

    let canal_alvo

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== 0)
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
        if (!canal_alvo.permissionsFor(client.id()).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Ativa ou desativa o logger no servidor
    if (!guild.conf.logger)
        guild.conf.logger = true
    else {

        // Verificando se o bot possui permissões para ver o registro de auditoria
        if (!guild.conf.logger) {
            const bot = await client.getMemberGuild(interaction, client.id())

            // Permissão para ver o registro de auditoria, desabilitando o logger
            if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

                guild.conf.logger = 0
                await guild.save()

                return client.notify(guild.logger.channel, { content: `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
            }
        }

        // Inverte o status de funcionamento apenas se executar o comando sem informar um canal
        if (!interaction.options.getChannel("value"))
            guild.conf.logger = !guild.conf.logger
        else
            guild.conf.logger = true
    }

    // Se usado sem mencionar um canal, desliga o logger
    if (!canal_alvo)
        guild.conf.logger = false

    await guild.save()

    if (guild.conf.logger)
        client.tls.reply(interaction, user, "mode.logger.ativado", true, client.defaultEmoji("guard"), `<#${guild.logger.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.logger.desativado", true, 11)
}