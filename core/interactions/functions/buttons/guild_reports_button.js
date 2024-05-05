const { PermissionsBitField, ChannelType } = require('discord.js')

const { banMessageEraser } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_external_reports", pagina_guia = 0
    const guild = await client.getGuild(interaction.guild.id)

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.reports.channel) {
        reback = "panel_guild.1"
        operacao = 4
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo de reportes externos

    // 3 -> Ativar ou desativar o aviso de novos usuários reportados
    // 4 -> Escolher canal de avisos
    // 5 -> Escolher cargo para ser mencionado

    // 2 -> Ativar ou desativar o AutoBan
    // 6 -> Escolher o tempo de exclusão de mensagens de membros banidos

    // 20 -> Sub-menu dos AutoBan
    // 21 -> Sub-menu com opções extras 

    if (operacao === 1) {

        // Ativa ou desativa o relatório de usuários mau comportados no servidor
        if (typeof guild.conf.reports !== "undefined")
            guild.conf.reports = !guild.conf.reports
        else
            guild.conf.reports = false

    } else if (operacao === 2) {

        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.BanMembers]))
            return client.reply(interaction, {
                content: client.tls.phrase(user, "manu.painel.sem_permissoes", 7),
                ephemeral: true
            })

        // Ativa ou desativa a opção de autoBan do comando /reporte
        if (typeof guild.reports.auto_ban !== "undefined")
            guild.reports.auto_ban = !guild.reports.auto_ban
        else
            guild.reports.auto_ban = true

        pagina_guia = 1
    } else if (operacao === 3) {

        // Ativa ou desativa o módulo de reportes externos do servidor
        if (typeof guild.reports.notify !== "undefined")
            guild.reports.notify = !guild.reports.notify
        else
            guild.reports.notify = true

        pagina_guia = 2
    } else if (operacao === 4) {

        // Definindo o canal de avisos dos relatórios externos
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            alvo: "guild_reports#channel",
            reback: "browse_button.guild_reports_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.reports.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.2` },
            { id: "guild_reports_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
        ]

        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 5) {

        // Definindo o cargo que receberá o avisos de entradas do reporte
        const data = {
            title: { tls: "menu.menus.escolher_cargo" },
            alvo: "guild_reports_button#role",
            reback: "browse_button.guild_reports_button",
            operation: operacao,
            values: []
        }

        if (guild.reports.role)
            data.values.push({ name: client.tls.phrase(user, "manu.guild_data.remover_cargo"), id: "none" })

        data.values = data.values.concat(await client.getGuildRoles(interaction, guild.reports.role, true))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}.2` },
            { id: "guild_reports_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "6" }
        ]

        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 6) {

        // Escolhendo o tempo de exclusão das mensagens para membros banidos pelo AutoBan
        const valores = []

        Object.keys(banMessageEraser).forEach(key => {
            if (guild.reports.erase_ban_messages !== parseInt(key) && !valores.includes(parseInt(key))) valores.push(parseInt(key))
        })

        const data = {
            title: { tls: "menu.menus.escolher_expiracao" },
            alvo: "guild_reports_ban_eraser",
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
    }

    await guild.save()

    if (operacao === 20) pagina_guia = 1
    else if (operacao === 21) pagina_guia = 2

    // Redirecionando a função para o painel de denuncias in-server
    require('../../chunks/panel_guild_external_reports')({ client, user, interaction, pagina_guia })
}