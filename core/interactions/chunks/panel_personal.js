const { EmbedBuilder } = require('discord.js')

const { emoji_button, type_button } = require('../../functions/emoji_button')

module.exports = async ({ client, user, interaction, pagina }) => {

    pagina = pagina || 0

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.painel.cabecalho_menu_pessoal"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

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
                name: `**${emoji_button(!user?.misc.weather)} ${client.tls.phrase(user, "manu.data.clima_resumido")}**`,
                value: client.tls.phrase(user, "manu.painel.desc_clima_resumido"),
                inline: true
            },
            {
                name: `**${emoji_button(user?.conf.global_tasks)} ${client.tls.phrase(user, "manu.data.tarefas_globais")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_tarefas_globais")}\``,
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
    // Badges visiveis públicamente, clima resumido e tarefas globais
    if (pagina === 1)
        botoes = botoes.concat([
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.badges_publicas"), type: type_button(user?.conf.public_badges), emoji: emoji_button(user?.conf.public_badges), data: '4' },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.clima_resumido"), type: type_button(!user?.misc.weather), emoji: emoji_button(!user?.misc.weather), data: '5' },
            { id: "user_panel_button", name: client.tls.phrase(user, "manu.data.tarefas_globais"), type: type_button(user?.conf.global_tasks), emoji: emoji_button(user?.conf.global_tasks), data: '6' }
        ])

    botoes.push({ id: "navigation_button_panel", name: '▶️', type: 0, data: `${pagina}.1.model_user_panel`, disabled: c_menu[1] })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}