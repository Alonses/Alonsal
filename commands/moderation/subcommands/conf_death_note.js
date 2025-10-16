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
        guild.death_note.channel = canal_alvo.id
    }

    // Sem canal informado no comando e nenhum canal salvo no cache do bot
    if (!canal_alvo && !guild.death_note.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {
        if (!guild.death_note.channel) // Sem canal salvo em cache
            return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)

        if (typeof canal_alvo !== "object") // Restaurando o canal do cache
            canal_alvo = await client.channels().get(guild.death_note.channel)

        if (!canal_alvo) { // Canal salvo em cache foi apagado
            guild.death_note.note = false
            await guild.save()

            return client.tls.reply(interaction, user, "mode.logger.canal_excluido", true, 1)
        }

        // Sem permissão para ver ou escrever no canal mencionado
        if (!await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal: canal_alvo }))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)
    }

    // Ativa ou desativa o logger no servidor
    if (!guild.death_note.note) guild.death_note.note = true
    else {
        // Inverte o status de funcionamento apenas se executar o comando sem informar um canal
        if (!interaction.options.getChannel("value"))
            guild.death_note.note = !guild.death_note.note
        else
            guild.death_note.note = true
    }

    // Se usado sem mencionar um canal, desliga o logger
    if (!canal_alvo) guild.death_note.note = false

    // Verificando as permissões do bot
    if (!await client.execute("permissions", { interaction, id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewAuditLog] })) {
        guild.death_note.note = false
        await guild.save()

        return client.reply(interaction, {
            content: client.tls.phrase(user, "manu.painel.salvo_sem_permissao", [10, 7]),
            flags: "Ephemeral"
        })
    }

    await guild.save()

    if (guild.death_note.note)
        client.tls.reply(interaction, user, "mode.death_note.ativado", true, client.defaultEmoji("guard"), `<#${guild.death_note.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.death_note.desativado", true, 11)
}