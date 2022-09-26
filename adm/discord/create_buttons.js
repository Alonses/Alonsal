const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = (lista_botoes, interaction) => {

    const row_buttons = new ActionRowBuilder()
    const tipos = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link] // Tipos de botão disponíveis

    // passando pelo array de botões e criando novos
    lista_botoes.forEach(valor => {

        valor.name = valor.name.length > 25 ? `${valor.name.slice(0, 25)}...` : valor.name

        if (valor.type === 4) {
            if (!valor.emoji)
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setLabel(valor.name)
                        .setURL(valor.value)
                        .setStyle(tipos[valor.type])
                )
            else
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setLabel(valor.name)
                        .setURL(valor.value)
                        .setStyle(tipos[valor.type])
                        .setEmoji(valor.emoji)
                )
        } else {
            if (!valor.emoji)
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${valor.name.slice(0, 4)}[${valor.name.split(":")[1]}]_${interaction.user.id}`)
                        .setLabel(valor.name.split(":")[0])
                        .setStyle(tipos[valor.type])
                )
            else
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setLabel(valor.name)
                        .setURL(valor.value)
                        .setStyle(tipos[valor.type])
                        .setEmoji(valor.emoji)
                )
        }
    })

    return row_buttons
}