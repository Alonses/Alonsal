const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)

    if (!guild.logger.channel)
        return interaction.update({
            content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
            ephemeral: true
        })

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo de reportes externos
    // 2 -> Ativar ou desativar o aviso de novos usuários reportados
    // 3 -> Escolher canal de avisos

    if (operacao === 1) {

        // Ativa ou desativa o módulo de reportes externos do servidor
        if (typeof guild.conf.reports !== "undefined")
            guild.conf.reports = !guild.conf.reports
        else
            guild.conf.reports = false

    } else if (operacao === 2) {

        // Ativa ou desativa o módulo de reportes externos do servidor
        if (typeof guild.reports.notify !== "undefined")
            guild.reports.notify = !guild.reports.notify
        else
            guild.reports.notify = true

    } else if (operacao === 3) {

        // Definindo o canal de avisos dos relatórios externos
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "reports_channel",
            values: await client.getGuildChannels(interaction, ChannelType.GuildText, guild.reports.channel)
        }

        let row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_external_reports" },
            { id: "reports_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "2" }
        ], interaction)

        return interaction.update({
            components: [client.create_menus(client, interaction, user, data), row],
            ephemeral: true
        })
    }

    await guild.save()

    // Redirecionando a função para o painel de anti-spam
    require('../../chunks/panel_external_reports')({ client, user, interaction })
}