const { getReportedUsers } = require("../../database/schemas/User_reports")

module.exports = async ({ client, interaction }) => {

    const reports = await getReportedUsers()

    const embed = client.create_embed({
        title: `> Reportes gerados ${client.defaultEmoji("guard")}`,
        color: "turquesa",
        fields: [
            {
                name: `${client.defaultEmoji("person")} **Reportados: ${reports.length}**`,
                value: "⠀",
                inline: true
            }
        ],
        footer: {
            text: "Selecione uma das opções abaixo para navegar",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    })

    const row = client.create_buttons([
        { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" }
    ], interaction)

    interaction.update({
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}