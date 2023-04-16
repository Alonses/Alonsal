const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

function create_buttons(lista_botoes, interaction) {

    const row_buttons = new ActionRowBuilder()
    const tipos = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link] // Tipos de botão disponíveis

    // Passando pelo array de botões e criando novos
    lista_botoes.forEach(valor => {

        // Nome da interação acionada
        let interaction_name = valor.name.split(":")[1]

        if (!valor.name.includes("report_user"))
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

            // Usado para as funções de reporte de usuários
            if (valor.report) {
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${valor.name.replaceAll(" ", "").slice(0, 14).split(":")[0]}[${interaction_name}].${interaction.user.id}.${valor.report}`)
                        .setLabel(valor.name.split(":")[0])
                        .setStyle(tipos[valor.type])
                )
            } else if (valor.badge) {
                // Usado para as funções de atribuição de badges aos usuários
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${valor.name.replaceAll(" ", "").slice(0, 14).split(":")[0]}[${interaction_name}].${interaction.user.id}.${valor.badge}`)
                        .setLabel(valor.name.split(":")[0])
                        .setStyle(tipos[valor.type])
                )
            } else if (valor.task) {
                // Usado para as funções de gerenciamento de anotações
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${valor.name.replaceAll(" ", "").slice(0, 14).split(":")[0]}[${interaction_name}].${interaction.user.id}.${valor.task}`)
                        .setLabel(valor.name.split(":")[0])
                        .setStyle(tipos[valor.type])
                )
            } else if (valor.list_r) {
                // Usado para as funções de gerenciamento de listas a serem apagas e anotações
                row_buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${valor.name.replaceAll(" ", "").slice(0, 14).split(":")[0]}[${interaction_name}].${interaction.user.id}.${valor.list_r}`)
                        .setLabel(valor.name.split(":")[0])
                        .setStyle(tipos[valor.type])
                )
            } else {

                if (!valor.emoji)
                    row_buttons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${valor.name.slice(0, 4)}[${interaction_name}]_${interaction.user.id}`)
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
        }
    })

    return row_buttons
}

module.exports.create_buttons = create_buttons