const { PermissionsBitField, ChannelType } = require('discord.js')

const { free_games } = require('../../../functions/free_games.js')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_free_games"
    const guild = await client.getGuild(interaction.guild.id)

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.games.channel) {
        reback = "panel_guild.1"
        operacao = 4
    }

    // Sem cargo de avisos definido, solicitando um cargo
    if (guild.games.channel && !guild.games.role) {
        reback = "panel_guild.1"
        operacao = 3
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar os jogos gratuitos
    // 2 -> Anunciando os jogos gratuitos do momento
    // 3 -> Escolher cargo para notificar
    // 4 -> Escolher canal para enviar o anuncio

    if (operacao === 1) {

        // Ativa ou desativa o módulo de jogos gratuitos do servidor
        if (typeof guild.conf.games !== "undefined")
            guild.conf.games = !guild.conf.games
        else
            guild.conf.games = true

    } else if (operacao === 2) {

        // Enviando um anúncio com os titulos de graça no momento
        const canal_alvo = client.discord.channels.cache.get(guild.games.channel)

        if (canal_alvo) {
            if (canal_alvo.type === 0 || canal_alvo.type === 5) {

                // Permissão para enviar mensagens no canal
                if (client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal_alvo)) {

                    // Enviando os games para anunciar no servidor
                    const guild_channel = guild.games.channel
                    free_games({ client, guild_channel })

                    return interaction.update({
                        content: client.replace(client.tls.phrase(user, "mode.anuncio.anuncio_enviado_duplicatas", client.emoji(29)), `<#${guild.games.channel}>`),
                        ephemeral: true
                    })
                } else // Sem permissão para enviar mensagens no canal
                    return interaction.update({
                        content: client.tls.phrase(user, "mode.anuncio.permissao_envio", client.defaultEmoji("guard")),
                        ephemeral: true
                    })

            } else // Tipo de canal inválido
                return interaction.update({
                    content: client.tls.phrase(user, "mode.anuncio.tipo_canal", client.defaultEmoji("types")),
                    ephemeral: true
                })

        } else // Sem canal configurado
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.configuracao", client.defaultEmoji("guard")),
                ephemeral: true
            })

    } else if (operacao === 3) {

        // Desabilitando o botão de escolher cargos se não tiver permissão
        if (! await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageRoles]))
            return interaction.update({
                content: `${client.emoji(7)} | Não é possível escolher cargos pelos menus sem a permissão "Gerenciar cargos" concedida.\nPor gentileza, conceda a permissão, ou faça a configuração através do comando </notify config:1018632996787589283>`,
                ephemeral: true
            })

        // Definindo o cargo que receberá o avisos de games free
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_free_games#role",
            reback: "browse_button.guild_free_games_button",
            operation: operacao,
            values: await client.getGuildRoles(interaction, guild.games.role)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_free_games_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 4) {

        // Definindo o canal de avisos de anúncio de games free
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_free_games#channel",
            reback: "browse_button.guild_free_games_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.logger.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_free_games_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "4" }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    }

    await guild.save()

    // Redirecionando a função para o painel de jogos gratuitos
    require('../../chunks/panel_guild_free_games')({ client, user, interaction, operacao })
}