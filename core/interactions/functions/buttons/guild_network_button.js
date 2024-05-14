const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')

const { banMessageEraser } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let pagina_guia = pagina || 0
    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_network"
    const guild = await client.getGuild(interaction.guild.id)

    // Sem servidores para o link definidos, criando um grupo
    if (!guild.network.link) {
        reback = "panel_guild.1"
        operacao = 3
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o network do servidor
    // 2 -> Escolher os eventos sincronizados no servidor
    // 4 -> Menu para confirmar quebra de link do network

    // 5 -> Escolher canal de avisos
    // 6 -> Definir tempo de exclusão do network para membros banidos

    // 9 -> Alterar de página dentro do guia
    // 11 -> Removendo o servidor do link do network

    if (operacao === 1) { // Ativa ou desativa o network do servidor

        // Verificando as permissões necessárias conforme os casos
        let niveis_permissao = [PermissionsBitField.Flags.ViewAuditLog]

        if (guild.network.member_ban_add) // Banimentos automaticos
            niveis_permissao.push(PermissionsBitField.Flags.BanMembers)

        if (guild.network.member_kick) // Expulsões automaticas
            niveis_permissao.push(PermissionsBitField.Flags.KickMembers)

        if (guild.network.member_punishment) // Castigos automaticos
            niveis_permissao.push(PermissionsBitField.Flags.ModerateMembers)

        // Verificando se o bot possui permissões requeridas conforme os recursos ativos
        if (!await client.permissions(interaction, client.id(), niveis_permissao))
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa o network do servidor
        guild.conf.network = !guild.conf.network

    } else if (operacao === 2) {

        const eventos = []

        Object.keys(guild.network).forEach(evento => {
            if (evento !== "link" && evento !== "channel")
                eventos.push({ type: evento, status: guild.network[evento] })
        })

        // Definindo os eventos que o network irá sincronizar no servidor
        const data = {
            title: { tls: "menu.menus.escolher_eventos" },
            alvo: "guild_network#events",
            reback: "browse_button.guild_network_button",
            operation: operacao,
            values: eventos
        }

        const botoes = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_network" }], interaction)
        const multi_select = true

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), botoes],
            ephemeral: true
        })
    } else if (operacao === 3) { // Servidor sem um link de network

        await interaction.deferUpdate({ ephemeral: true })

        // Listando todos os servidores que o usuário é moderador
        // Selecionando os servidores para vincular ao network
        const permissions = [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers]
        const guilds = await client.getMemberGuildsByPermissions({ interaction, user, permissions })

        if (guilds.length < 1)
            return interaction.editReply({
                content: client.tls.phrase(user, "mode.network.sem_servidores"),
                ephemeral: true
            })

        // Listando os servidores para o moderador
        const data = {
            title: { tls: "menu.menus.escolher_guilds" },
            alvo: "guild_network#link",
            reback: "browse_button.guild_network_button",
            operation: operacao,
            values: guilds
        }

        // Subtrai uma página do total ( em casos de saída de um servidor em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback }]
        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        const multi_select = true

        return interaction.editReply({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 4) {

        // Quebrando o link do servidor
        const embed = new EmbedBuilder()
            .setTitle(`> Networking ${client.emoji(36)}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "manu.guild_data.descricao_quebra_link", 2))
            .setFields({
                name: `:link: **${client.tls.phrase(user, "manu.guild_data.outros_servidores")}:**`,
                value: guild.network.link ? await client.getNetWorkGuildNames(guild.network.link, interaction) : client.tls.phrase(user, "manu.guild_data.sem_servidores"),
                inline: true
            })
            .setFooter({
                text: client.tls.phrase(user, "manu.painel.rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        const botoes = [
            { id: "guild_network_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: "11" },
            { id: "guild_network_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: "0" }
        ]

        return client.reply(interaction, {
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction)]
        })

    } else if (operacao === 5) {

        // Escolhendo o canal de avisos dos eventos do network
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            alvo: "guild_network#channel",
            reback: "browse_button.guild_network_button",
            operation: operacao,
            values: []
        }

        if (guild.network.channel)
            data.values.push({ name: client.tls.phrase(user, "manu.guild_data.remover_canal"), id: "none" })

        // Listando os canais do servidor
        data.values = data.values.concat(await client.getGuildChannels(interaction, ChannelType.GuildText, guild.network.channel))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.1` },
            { id: "guild_network_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "5" }
        ]

        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 6) {

        // Escolhendo o tempo de exclusão das mensagens para membros banidos no network
        const valores = []

        Object.keys(banMessageEraser).forEach(key => {
            if (guild.network.erase_ban_messages !== parseInt(key) && !valores.includes(parseInt(key))) valores.push(parseInt(key))
        })

        const data = {
            title: { tls: "menu.menus.escolher_expiracao" },
            alvo: "guild_network_ban_eraser",
            number_values: true,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.1`
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })

    } else if (operacao === 11) {

        // Confirmando a remoção do servidor do link do network
        guild.conf.network = false
        guild.network.link = null
    }

    await guild.save()

    if (operacao >= 4)
        pagina_guia = 1

    // Redirecionando a função para o painel do networking
    require('../../chunks/panel_guild_network')({ client, user, interaction, operacao, pagina_guia })
}