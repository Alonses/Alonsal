const { EmbedBuilder } = require('discord.js')

const { emoji_button, type_button } = require('../../functions/emoji_button')

module.exports = async (client, user, interaction, pagina) => {

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu_pessoal"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (typeof pagina === "undefined")
        pagina = 0

    if (pagina === 0)
        embed.addFields(
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

    if (pagina === 1)
        embed.addFields(
            {
                name: `**${emoji_button(user?.conf.public_badges)} ${client.tls.phrase(user, "manu.data.badges_publicas")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_badges_publicas")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(false)} ${client.tls.phrase(user, "manu.painel.misterioso")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_misterioso")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(false)} ${client.tls.phrase(user, "manu.painel.misterioso")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_misterioso")}\``,
                inline: true
            }
        )

    const c_menu = [false, false]
    c_menu[pagina] = true

    let botoes = [{ id: "navigation_button_panel", name: '◀️', type: 0, data: `${pagina}.0.model_user_panel`, disabled: c_menu[0] }]

    // Primeira página de botões de configuração do usuário
    // Modo fantasma, notificações em DM e Ranking
    if (pagina === 0)
        botoes = botoes.concat([
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.ghostmode"), type: type_button(user?.conf.ghost_mode), emoji: emoji_button(user?.conf.ghost_mode), data: '1' },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.notificacoes"), type: type_button(user?.conf.notify), emoji: emoji_button(user?.conf.notify), data: '2' },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.ranking"), type: type_button(user?.conf.ranking), emoji: emoji_button(user?.conf.ranking), data: '3' }
        ])

    // Segunda página de botões de configuração do Alonsal
    // Badges visiveis públicamente
    if (pagina === 1)
        botoes = botoes.concat([
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.badges_publicas"), type: type_button(user?.conf.public_badges), emoji: emoji_button(user?.conf.public_badges), data: '4' },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.painel.misterioso"), type: type_button(false), emoji: emoji_button(false), data: '5', disabled: true },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.painel.misterioso"), type: type_button(false), emoji: emoji_button(false), data: '6', disabled: true }
        ])

    botoes.push({ id: "navigation_button_panel", name: '▶️', type: 0, data: `${pagina}.1.model_user_panel`, disabled: c_menu[1] })
    const row = client.create_buttons(botoes, interaction)

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