const { rgbToHex } = require('../../../core/functions/hex_color')

module.exports = async ({ client, user, interaction }) => {

    // Cor customizada
    const rgb = {
        r: interaction.options.getInteger("r"),
        g: interaction.options.getInteger("g"),
        b: interaction.options.getInteger("b")
    }

    // Convertendo do RGB para HEX
    const new_color = rgbToHex(rgb.r, rgb.g, rgb.b)

    if (user.misc.color === new_color)
        return client.tls.reply(interaction, user, "misc.color.cor_ativa", true, 7)

    // Enviando o embed para validação
    const embed = client.create_embed({
        title: { tls: "misc.color.titulo" },
        color: new_color,
        thumbnail: interaction.user.avatarURL({ dynamic: true }),
        description: { tls: "misc.color.descricao" },
        footer: {
            text: { tls: "misc.color.footer" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para a cor customizada
    const row = client.create_buttons([
        { id: "user_custom_color", name: { tls: "menu.botoes.confirmar" }, type: 2, emoji: client.emoji(10), data: `1|custom-${new_color}` },
        { id: "user_custom_color", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: 0 }
    ], interaction, user)

    interaction.reply({
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}