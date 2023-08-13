const { EmbedBuilder } = require('discord.js')

const { emoji_button, type_button } = require('../../funcoes/emoji_button')

module.exports = async (client, user, interaction) => {

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu_pessoal"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .addFields(
            {
                name: `**${emoji_button(user?.conf.ghost_mode)} ${client.tls.phrase(user, "manu.data.ghostmode")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_ghostmode")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(user?.conf.notify)} ${client.tls.phrase(user, "manu.data.notificacoes")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_notificacoes")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(user?.conf.ranking)} ${client.tls.phrase(user, "manu.data.ranking")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_ranking")}\``,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const row = client.create_buttons([
        { id: "painel_button", name: client.tls.phrase(user, "manu.data.ghostmode"), type: type_button(user?.conf.ghost_mode), emoji: emoji_button(user?.conf.ghost_mode), data: '1' },
        { id: "painel_button", name: client.tls.phrase(user, "manu.data.notificacoes"), type: type_button(user?.conf.notify), emoji: emoji_button(user?.conf.notify), data: '2' },
        { id: "painel_button", name: client.tls.phrase(user, "manu.data.ranking"), type: type_button(user?.conf.ranking), emoji: emoji_button(user?.conf.ranking), data: '3' }
    ], interaction)

    if (!interaction.customId)
        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    else
        interaction.update({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
}