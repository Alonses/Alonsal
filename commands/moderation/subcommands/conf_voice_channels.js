const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let canal
    const guild = await client.getGuild(interaction.guild.id)

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("value")) {

        // Mencionado um tipo de canal errado
        if (interaction.options.getChannel("value").type !== ChannelType.GuildCategory)
            return client.tls.reply(interaction, user, "mode.anuncio.tipo_canal", true, client.defaultEmoji("types"))

        // Atribuindo a categoria passada para os tickets
        canal = interaction.options.getChannel("value")
        guild.voice_channels.category = canal.id
    }

    // Sem categoria informada no comando e nenhuma categoria salva no cache do bot
    if (!canal && !guild.voice_channels.category)
        return client.tls.reply(interaction, user, "mode.logger.mencao_canal", true, 1)
    else {

        if (!canal) // Sem categoria informada no comando
            return interaction.reply({
                content: `:mag: | Sem categoria informada, por gentileza informe uma categoria para que eu possa criar \`🔊 canais de voz temporários\` no servidor.`,
                flags: "Ephemeral"
            })

        // Sem permissão para ver ou gerenciar canais na categoria mencionada
        if (!await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels], canal }))
            return client.tls.reply(interaction, user, "mode.logger.falta_escrita_visualizacao", true, 1)

        await guild.save()

        interaction.reply({
            content: `:passport_control: :white_check_mark: | A categoria onde serão criados \`🔊 canais de voz temporários\` foi alterada com sucesso!\nNovos canais que forem criados ficarão sob a categoria ${canal}`,
            flags: "Ephemeral"
        })
    }
}