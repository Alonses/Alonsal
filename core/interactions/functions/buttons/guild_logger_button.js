const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const operacao = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)

    if (!guild.logger.channel)
        return interaction.update({
            content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
            ephemeral: true
        })

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o log de eventos
    // 2 -> Eventos do logger
    // 3 -> Escolher canal de avisos
    // 4 -> Alterar o idioma do servidor

    if (operacao === 1) {

        // Verificando se o bot possui permissões para ver o registro de auditoria
        if (typeof guild.conf.logger !== "undefined") {
            if (!guild.conf.logger) {
                const aprovacao = client.verifyLogger(interaction)

                if (!aprovacao)
                    client.notify(guild.logger.channel, { content: `@here ${client.tls.phrase(guild, "mode.logger.permissao", 7)}` })
            }

            // Ativa ou desativa o log de eventos do servidor
            guild.conf.logger = !guild.conf.logger
        } else
            guild.conf.logger = true

    } else if (operacao === 2) {

        const eventos = []

        Object.keys(guild.logger).forEach(evento => {
            if (evento !== "channel")
                eventos.push({ type: evento, status: guild.logger[evento] })
        })

        // Definindo os eventos que o log irá relatar no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_logger#events",
            reback: "browse_button.guild_logger_button",
            operation: operacao,
            values: eventos
        }

        const botoes = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_logger" }], interaction)
        const multi_select = true

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), botoes],
            ephemeral: true
        })
    } else if (operacao === 3) {

        // Definindo o canal de avisos do log de eventos
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_logger#channel",
            reback: "browse_button.guild_logger_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.logger.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_logger" },
            { id: "guild_logger_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 4) {

        // Alterando o idioma do servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_logger#language",
            reback: "browse_button.guild_logger_button",
            operation: operacao,
            values: await client.listLanguages(guild.lang)
        }

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_logger" }], interaction)],
            ephemeral: true
        })
    }

    await guild.save()

    // Redirecionando a função para o painel do log de eventos
    require('../../chunks/panel_guild_logger')({ client, user, interaction, operacao })
}