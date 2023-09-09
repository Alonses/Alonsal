module.exports = async ({ client, user, interaction }) => {

    const embed = await require('../../generators/journal')({ client })

    const row = client.create_buttons([
        { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" }
    ], interaction)

    interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}