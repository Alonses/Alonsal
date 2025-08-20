module.exports = async ({ client, user, interaction }) => {

    const embed = client.create_embed({
        title: { tls: "manu.telemetria.titulo" },
        image: "https://cdn.discordapp.com/attachments/987852330064039988/1049109914120884224/image.png",
        description: { tls: "manu.telemetria.descricao" },
        footer: {
            text: { tls: "manu.telemetria.rodape" }
        }
    }, user)

    const row = client.create_buttons([
        { id: "data_menu_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: '0' }
    ], interaction, user)

    interaction.update({
        content: "",
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}