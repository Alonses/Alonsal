const { dropReport, checkUserGuildReported } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancelar
    // 1 -> Confirma remoção
    // 2 -> Menu para escolher o usuário
    // 3 -> Menu para confirmar a escolha de remoção

    const id_alvo = dados.split(".")[2]
    const id_guild = dados.split(".")[3]

    if (operacao === 0) { // Operação cancelada ( retorna ao embed do usuário )
        dados = `${id_alvo}.${id_guild}.${pagina}`
        return require('../../chunks/verify_report')({ client, user, interaction, dados })
    }

    if (operacao === 1) {

        // Removendo o reporte do usuário no servidor
        await dropReport(id_alvo, id_guild)

        // Verificando se há outros usuários reportados no servidor para poder continuar editando
        let reportes_server = await checkUserGuildReported(id_guild), row

        const obj = {
            content: client.tls.phrase(user, "mode.report.usuario_removido", 10),
            embeds: [],
            components: [],
            ephemeral: true
        }

        if (reportes_server.length > 0) {
            row = client.create_buttons([
                { id: "return_button", name: client.tls.phrase(user, "menu.botoes.ver_usuarios"), type: 0, emoji: client.emoji(19), data: "remove_report" }
            ], interaction)

            obj.components.push(row)
        }

        return interaction.update(obj)
    }

    if (operacao === 2) {

        // Criando os botões para o menu de remoção de reportes do servidor
        const row = client.create_buttons([
            { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${interaction.guild.id}` },
            { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${interaction.guild.id}` }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })
    }

    if (operacao === 3) {
        // Menu para navegar entre os usuários reportados
        const reportes_guild = await checkUserGuildReported(interaction.guild.id)

        if (reportes_guild.length < 1)
            return client.tls.reply(user, "mode.report.usuario_sem_reportes", true, 1)

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (reportes_guild.length < pagina * 24)
            pagina--

        const data = {
            alvo: "remove_report",
            reback: "browse_button.report_remove_user",
            operation: 3,
            values: reportes_guild
        }

        const obj = {
            content: client.tls.phrase(user, "mode.report.escolher_usuario_gerencia"),
            embeds: [],
            components: [client.create_menus({ client, interaction, user, data, pagina })],
            ephemeral: true
        }

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            obj.components.push(client.create_buttons(row, interaction))

        client.reply(interaction, obj)
    }
}