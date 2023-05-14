const { EmbedBuilder } = require('discord.js')
const emoji_button = require('../../funcoes/emoji_button')

module.exports = async (client, user, interaction) => {

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .addFields(
            {
                name: `**${emoji_button(user?.conf.ghost_mode)} ${client.tls.phrase(user, "manu.data.ghostmode")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `**${emoji_button(user?.conf.notify)} ${client.tls.phrase(user, "manu.data.notificacoes")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `**${emoji_button(user?.conf.ranking)} ${client.tls.phrase(user, "manu.data.ranking")}**`,
                value: "⠀",
                inline: true
            }
        )
        .setFooter({ text: client.tls.phrase(user, "manu.painel.rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

    const row = client.create_buttons([{ id: "painel_button", name: client.tls.phrase(user, "manu.data.ghostmode"), value: '1', type: type_button(user?.conf.ghost_mode), emoji: emoji_button(user?.conf.ghost_mode), data: '1' }, { id: "painel_button", name: client.tls.phrase(user, "manu.data.notificacoes"), value: '1', type: type_button(user?.conf.notify), emoji: emoji_button(user?.conf.notify), data: '2' }, { id: "painel_button", name: client.tls.phrase(user, "manu.data.ranking"), value: '1', type: type_button(user?.conf.ranking), emoji: emoji_button(user?.conf.ranking), data: '3' }], interaction)

    if (!interaction.customId)
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    else
        interaction.update({ embeds: [embed], components: [row], ephemeral: true })
}

function type_button(dado) {

    // Tipos de botões
    // true -> Ativado ( verde | 2 )
    // false -> Desativado ( cinza | 0 )

    let retorno = 2

    if (typeof dado !== "undefined" && dado !== null)
        if (dado)
            retorno = 2
        else
            retorno = 1

    return retorno
}