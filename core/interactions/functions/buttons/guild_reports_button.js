const { PermissionsBitField, ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_external_reports"
    const guild = await client.getGuild(interaction.guild.id)

    if (!guild.reports.channel) {
        reback = "panel_guild.1"
        operacao = 4
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo de reportes externos
    // 2 -> Ativar ou desativar o AutoBan
    // 3 -> Ativar ou desativar o aviso de novos usuários reportados
    // 4 -> Escolher canal de avisos

    if (operacao === 1) {

        // Ativa ou desativa o relatório de usuários mau comportados no servidor
        if (typeof guild.conf.reports !== "undefined")
            guild.conf.reports = !guild.conf.reports
        else
            guild.conf.reports = false

    } else if (operacao === 2) {

        const membro_sv = await client.getMemberGuild(interaction, client.id())

        // Permissões para banir outros membros
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))
            return client.tls.report(interaction, user, "mode.report.auto_ban_painel", true, 7, null, true)

        // Ativa ou desativa a opção de autoBan do comando /reporte
        if (typeof guild.reports.auto_ban !== "undefined")
            guild.reports.auto_ban = !guild.reports.auto_ban
        else
            guild.reports.auto_ban = true

    } else if (operacao === 3) {

        // Ativa ou desativa o módulo de reportes externos do servidor
        if (typeof guild.reports.notify !== "undefined")
            guild.reports.notify = !guild.reports.notify
        else
            guild.reports.notify = true

    } else if (operacao === 4) {

        // Definindo o canal de avisos dos relatórios externos
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "guild_reports#channel",
            reback: "browse_button.guild_reports_button",
            operation: operacao,
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.reports.channel)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "guild_reports_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
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

    // Redirecionando a função para o painel de denuncias in-server
    require('../../chunks/panel_guild_external_reports')({ client, user, interaction })
}