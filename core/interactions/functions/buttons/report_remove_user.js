const { dropReport, checkUserGuildReported } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    if (operacao === 0)
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

    if (reportes_server.length > 0) {
        row = client.create_buttons([
            { id: "return_button", name: "Ver outros usuários", type: 0, emoji: client.emoji(19), data: "remove_report" }
        ], interaction)

        return interaction.update({
            content: ":white_check_mark: | O usuário foi removido da lista de reportes do servidor, obrigado!!",
            embeds: [],
            components: [row],
            ephemeral: true
        })
    } else
        return interaction.update({
            content: ":white_check_mark: | O usuário foi removido da lista de reportes do servidor, obrigado!!",
            embeds: [],
            components: [],
            ephemeral: true
        })
}