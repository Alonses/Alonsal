const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    pagina = pagina || 0

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_speaker"
    const guild = await client.getGuild(interaction.guild.id)

    // Sem canais definidos, solicitando um canal
    if (!guild.speaker.channels && !guild.speaker.regional_limit && operacao === 2)
        operacao = 3

    // Tratamento dos cliques
    // 1 -> (Des)Ativa o Alonsal conversador
    // 2 -> (Des)Ativa o bloqueio por canais
    // 3 -> Selecionar quais canais serão liberados para a conversação

    if (operacao === 1) {

        // Ativa ou desativa a capacidade do Alonsal falar no servidor livremente ( através do clever )
        if (typeof guild.conf.conversation !== "undefined")
            guild.conf.conversation = !guild.conf.conversation
        else
            guild.conf.conversation = false

    } else if (operacao === 2) {

        // Ativa ou desativa a capacidade do Alonsal falar no servidor livremente ( através do clever )
        if (typeof guild.speaker.regional_limit !== "undefined")
            guild.speaker.regional_limit = !guild.speaker.regional_limit
        else
            guild.speaker.regional_limit = true

    } else if (operacao === 3) {

        // Definindo o canal de avisos do log de eventos
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_speaker#channel",
            reback: "browse_button.guild_speaker_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_speaker_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
        ]

        let row = client.menu_navigation(data, pagina || 0)
        const multi_select = true

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select, guild }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    }

    await guild.save()

    require('../../chunks/panel_guild_speaker')({ client, user, interaction })
}