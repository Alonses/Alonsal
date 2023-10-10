const { dropReport, checkUserGuildReported } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const operacao = parseInt(dados.split(".")[1])

    if (operacao !== 3) {
        if (!operacao)
            return interaction.update({
                content: ":anger: | A operação foi cancelada, nenhum efeito foi aplicado...",
                embeds: [],
                components: [],
                ephemeral: true
            })

        // Removendo o reporte do usuário no servidor
        const id_alvo = dados.split(".")[2]
        const id_guild = dados.split(".")[3]

        await dropReport(id_alvo, id_guild)

        // Verificando se há outros usuários reportados no servidor para poder continuar editando
        let reportes_server = await checkUserGuildReported(id_guild), row

        const obj = {
            content: ":white_check_mark: | O usuário foi removido da lista de reportes do servidor, obrigado!!",
            embeds: [],
            components: [],
            ephemeral: true
        }

        if (reportes_server.length > 0) {
            row = client.create_buttons([
                { id: "return_button", name: "Ver outros usuários", type: 0, emoji: client.emoji(19), data: "remove_report" }
            ], interaction)

            obj.components.push(row)
        }

        return interaction.update(obj)

    } else {

        // Menu para navegar entre os usuários reportados
        const reportes_guild = await checkUserGuildReported(interaction.guild.id)

        if (reportes_guild.length < 1)
            return interaction.reply({ content: ":mag: | Este servidor não possui nenhum reporte registrado!", ephemeral: true })

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
            content: "Escolha um usuário abaixo para poder gerenciar",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data, pagina || 0)],
            ephemeral: true
        }

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            obj.components.push(client.create_buttons(row, interaction))

        client.reply(interaction, obj)
    }
}