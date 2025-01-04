const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.telemetria.titulo"))
        .setColor(client.embed_color(user.misc.color))
        .setImage("https://cdn.discordapp.com/attachments/987852330064039988/1049109914120884224/image.png")
        .setDescription(client.tls.phrase(user, "manu.telemetria.descricao"))
        .setFooter({
            text: client.tls.phrase(user, "manu.telemetria.rodape")
        })

    const row = client.create_buttons([
        { id: "data_menu_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: '0' }
    ], interaction)

    interaction.update({
        content: "",
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}