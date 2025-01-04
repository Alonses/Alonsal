const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let canal_alvo
    const guild = await client.getGuild(interaction.guild.id)

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== ChannelType.GuildText)
            return client.tls.reply(interaction, user, "mode.anuncio.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo a categoria passada para os tickets
        canal_alvo = interaction.options.getChannel("value")
        guild.timed_roles.channel = canal_alvo.id
    }

    // Sem categoria informada no comando e nenhuma categoria salva no cache do bot
    if (!canal_alvo && !guild.timed_roles.channel)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {

        // Sem permissão para ver ou escrever no canal mencionado
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal_alvo))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)

        await guild.save()

        interaction.reply({
            content: `:passport_control: :white_check_mark: | O canal para os avisos dos \`⌚ Cargos temporários\` foi alterado com sucesso!\nNovos cargos que forem concedidos serão notificados em ${canal_alvo}`,
            flags: "Ephemeral"
        })
    }
}