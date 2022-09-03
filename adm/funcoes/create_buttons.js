const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = (lista_botoes) => {

    const row_buttons = new ActionRowBuilder()
    const tipos = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link] // Tipos de botão disponíveis

    // passando pelo array de botões e criando novos
    lista_botoes.forEach(valor => {
        if (valor.type === 4) {
            row_buttons.addComponents(
                new ButtonBuilder()
                    .setLabel(valor.name.length > 25 ? `${valor.name.slice(0, 25)}...` : valor.name)
                    .setURL(valor.value)
                    .setStyle(tipos[valor.type])
            )
        } else {
            row_buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId(valor.name.slice(0, 4))
                    .setLabel(valor.name.length > 25 ? `${valor.name.slice(0, 25)}...` : valor.name)
                    .setStyle(tipos[valor.type])
            )
        }
    })

    return row_buttons
}