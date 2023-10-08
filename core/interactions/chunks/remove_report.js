const { checkUserGuildReported } = require("../../database/schemas/Report")

module.exports = async ({ client, user, interaction, pagina }) => {

    const reportes_guild = await checkUserGuildReported(interaction.guild.id)

    if (reportes_guild.length < 1)
        return interaction.reply({ content: ":mag: | Este servidor não possui nenhum reporte registraod!", ephemeral: true })

    const data = {
        alvo: "remove_report",
        values: reportes_guild
    }

    let row, b_disabled = [false, false]
    b_disabled[pagina] = true

    if (Math.ceil(reportes_guild.length / 25) > 1)
        row = client.create_buttons([
            { id: "remove_report_navegar", name: '◀️', type: 1, data: `0|${pagina}.remove_report_navegar`, disabled: b_disabled[0] },
            { id: "remove_report_navegar", name: '▶️', type: 1, data: `1|${pagina}.remove_report_navegar`, disabled: b_disabled[1] }
        ], interaction)

    if (pagina > 0)
        pagina = (pagina * 25) - 1

    if (!interaction.customId)
        interaction.reply({
            content: "Escolha um usuário abaixo para poder gerenciar",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data, pagina), row],
            ephemeral: true
        })
    else
        interaction.update({
            content: "Escolha um usuário abaixo para poder gerenciar",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data, pagina), row],
            ephemeral: true
        })
}