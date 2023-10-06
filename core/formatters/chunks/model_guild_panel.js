const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emoji_button, type_button } = require('../../functions/emoji_button')

module.exports = async (client, user, interaction, pagina) => {

    const guild = await client.getGuild(interaction.guild.id)
    const membro_sv = await client.getMemberGuild(interaction, interaction.user.id)

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "manu.painel.cabecalho_menu_servidor")} :globe_with_meridians:`)
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
                name: `**${emoji_button(guild?.conf.conversation)} ${client.tls.phrase(user, "manu.painel.alonsal_falador")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_falador")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.broadcast)} ${client.tls.phrase(user, "manu.painel.permitir_broadcast")}**`,
                value: `${client.tls.phrase(user, "manu.painel.desc_broadcast")}`,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.games)} ${client.tls.phrase(user, "manu.painel.anuncio_games")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_games")}\``,
                inline: true
            }
        )

    if (pagina == 1)
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.tickets)} ${client.tls.phrase(user, "manu.painel.denuncias_server")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_denuncias")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.reports)} ${client.tls.phrase(user, "manu.painel.reports_externos")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_reports")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.logger)} ${client.tls.phrase(user, "manu.painel.log_eventos")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_logger")}\``,
                inline: true
            }
        )

    if (pagina == 2)
        embed.addFields(
            {
                name: `**${emoji_button(guild?.conf.spam)} ${client.tls.phrase(user, "manu.painel.anti_spam")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_spam")}\``,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.public)} ${client.tls.phrase(user, "manu.painel.visibilidade_global")}**`,
                value: `${client.tls.phrase(user, "manu.painel.desc_global")}`,
                inline: true
            },
            {
                name: `**${emoji_button(guild?.conf.auto_ban)} AutoBan**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_autoban")}\``,
                inline: true
            }
        )

    const c_buttons = [false, false, false, false, false, false, false, false, false]
    const c_menu = [false, false]

    if (pagina == 0) // Botão de voltar
        c_menu[0] = true
    if (pagina == 2) // Botão para avançar
        c_menu[1] = true

    let botoes = [{ id: "navigation_button_panel", name: '◀️', type: 0, data: `${pagina}.0.model_guild_panel`, disabled: c_menu[0] }]

    // Falta de permissões para gerenciar o sistema de denúncias
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        c_buttons[3] = true

    // Falta de permissões para gerenciar o sistema de reportes, o alonsal falante, o broadcast entre servidores
    // o Log de eventos e o módulo anti-spam
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        c_buttons[0] = true
        c_buttons[1] = true
        c_buttons[4] = true
        c_buttons[5] = true
        c_buttons[6] = true
    }

    // Falta de permissões para gerenciar o servidor no ranking global e o anúncios de games
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        c_buttons[2] = true
        c_buttons[7] = true
    }

    // Falta de permissões para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))
        c_buttons[8] = true

    // Primeira página de botões de configuração do Alonsal
    // Alonsal Falador; Broadcast e Anúncio de games
    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.alonsal_falador"), type: type_button(guild?.conf.conversation), emoji: emoji_button(guild?.conf.conversation), data: '1', disabled: c_buttons[0] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.permitir_broadcast"), type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: '2', disabled: c_buttons[1] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.anuncio_games"), type: type_button(guild?.conf.games), emoji: emoji_button(guild?.conf.games), data: '3', disabled: c_buttons[2] }
        ])

    // Segunda página de botões de configuração do Alonsal
    // Denúncias in-server; Reportes externos e Log de eventos
    if (pagina === 1)
        botoes = botoes.concat([
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.denuncias_server"), type: type_button(guild?.conf.tickets), emoji: emoji_button(guild?.conf.tickets), data: '4', disabled: c_buttons[3] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.reports_externos"), type: type_button(guild?.conf.reports), emoji: emoji_button(guild?.conf.reports), data: '5', disabled: c_buttons[4] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.log_eventos"), type: type_button(guild?.conf.logger), emoji: emoji_button(guild?.conf.logger), data: '6', disabled: c_buttons[5] }
        ])

    // Terceira página de botões de configuração do Alonsal
    // Módulo anti-spam e Visibilidade Global
    if (pagina === 2)
        botoes = botoes.concat([
            { id: "anti_spam_button", name: client.tls.phrase(user, "manu.painel.anti_spam"), type: 1, emoji: client.emoji(41), data: "0", disabled: c_buttons[6] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.visibilidade_global"), type: type_button(guild?.conf.public), emoji: emoji_button(guild?.conf.public), data: '8', disabled: c_buttons[7] },
            { id: "guild_panel_button", name: "AutoBan", type: type_button(guild?.conf.auto_ban), emoji: emoji_button(guild?.conf.auto_ban), data: '9', disabled: c_buttons[8] }
        ])

    botoes.push({ id: "navigation_button_panel", name: '▶️', type: 0, data: `${pagina}.1.model_guild_panel`, disabled: c_menu[1] })
    const row = client.create_buttons(botoes, interaction)

    if (!interaction.customId)
        interaction.reply({
            content: "",
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    else
        interaction.update({
            content: "",
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
}