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
    // 4 -> Escolher canal para enviar o anúncio

    // Ativa ou desativa o módulo de jogos gratuitos do servidor
    if (operacao === 1) {

        guild.conf.games = !guild.conf.games
        await guild.save()

    } else if (operacao === 2) {

        // Enviando um anúncio com os titulos de graça no momento
        const canal = client.discord.channels.cache.get(guild.games.channel)

        if (canal) {

            // Permissão para enviar mensagens no canal
            if (await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal })) {

                // Enviando os games para anunciar no servidor
                const guild_channel = guild.games.channel
                free_games({ client, guild_channel })

                return interaction.update({
                    content: client.tls.phrase(user, "mode.anuncio.anuncio_enviado_duplicatas", client.emoji(29), `<#${guild.games.channel}>`),
                    flags: "Ephemeral"
                })
            } else // Sem permissão para enviar mensagens no canal
                return interaction.update({
                    content: client.tls.phrase(user, "mode.anuncio.permissao_envio", client.defaultEmoji("guard")),
                    flags: "Ephemeral"
                })

        } else // Sem canal configurado
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.configuracao", client.defaultEmoji("guard")),
                flags: "Ephemeral"
            })

    } else if (operacao === 3) {

        // Desabilitando o botão de escolher cargos se não tiver permissão
        if (!await client.execute("permissions", { interaction, id_user: client.id(), permissions: [PermissionsBitField.Flags.ManageRoles] }))
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.permissao_cargos", 7),
                flags: "Ephemeral"
            })

        // Definindo o cargo que receberá o avisos de games free
        const data = {
            title: { tls: "menu.menus.escolher_cargo" },
            pattern: "choose_role",
            alvo: "guild_free_games#role",
            reback: "browse_button.guild_free_games_button",
            operation: operacao,
            values: await client.execute("getGuildRoles", { interaction, ignore_role: guild.games.role, allow_mods: true })
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.execute("menu_navigation", { user, data, pagina })
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback },
            { id: "guild_free_games_button", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: "3" }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 4) {

        // Definindo o canal de avisos de anúncio de games free
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            pattern: "choose_channel",
            alvo: "guild_free_games#channel",
            reback: "browse_button.guild_free_games_button",
            operation: operacao,
            values: await client.execute("getGuildChannels", {
                interaction,
                user,
                tipo: ChannelType.GuildText,
                id_configurado: guild.games.channel
            })
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.execute("menu_navigation", { user, data, pagina })
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: reback },
            { id: "guild_free_games_button", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: "4" }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })
    }

    // Redirecionando a função para o painel de jogos gratuitos
    require('../../chunks/panel_guild_free_games')({ client, user, interaction, operacao })
}