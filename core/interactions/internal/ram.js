module.exports = async ({ client, interaction }) => {

    const used = process.memoryUsage()
    let text = "Uso de RAM:\n"

    for (let key in used)
        text += `${key}: **${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB**\n`

    const row = client.create_buttons([
        { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" }
    ], interaction)

    interaction.update({
        content: text,
        embeds: [],
        components: [row],
        ephemeral: true
    })
}