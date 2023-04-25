const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

function create_buttons(dados, interaction) {

    const row_buttons = new ActionRowBuilder()
    const tipos = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link] // Tipos de botão disponíveis

    // Passando pelo array de botões e criando novos
    dados.forEach(botao => {

        if (botao.id)
            if (!botao.id.includes("report_user"))
                botao.name = botao.name.length > 25 ? `${botao.name.slice(0, 25)}...` : botao.name

        if (botao.type === 4) {
            if (!botao.emoji)
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setLabel(botao.name)
                        .setURL(botao.value)
                        .setStyle(tipos[botao.type])
                )
            else
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setLabel(botao.name)
                        .setURL(botao.value)
                        .setStyle(tipos[botao.type])
                        .setEmoji(botao.emoji)
                )
        } else {

            // Usado para as funções que alteram o banco de dados
            if (botao.data) {
                if (!botao.emoji)
                    row_buttons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${botao.id}|${interaction.user.id}.${botao.data}`)
                            .setLabel(botao.name)
                            .setStyle(tipos[botao.type])
                    )
                else // Botão com emoji definido
                    row_buttons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${botao.id}|${interaction.user.id}.${botao.data}`)
                            .setLabel(botao.name)
                            .setStyle(tipos[botao.type])
                            .setEmoji(botao.emoji)
                    )
            } else {
                if (!botao.emoji)
                    row_buttons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${botao.id}|${interaction.user.id}`)
                            .setLabel(botao.name)
                            .setStyle(tipos[botao.type])
                    )
                else // Botão com emoji definido
                    row_buttons.addComponents(
                        new ButtonBuilder()
                            .setLabel(botao.name)
                            .setURL(botao.value)
                            .setStyle(tipos[botao.type])
                            .setEmoji(botao.emoji)
                    )
            }
        }
    })

    return row_buttons
}

module.exports = {
    create_buttons
}