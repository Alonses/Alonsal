const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emoji_button, type_button } = require('../../functions/emoji_button')

const operation_codes = {
    "speaker": 0,
    "broadcast": 1,
    "free_games": 2,
    "tickets": 3,
    "external_reports": 4,
    "logger": 5,
    "anti_spam": 6,
    "public_guild": 7,
    "network": 8,
    "warns": 9,
    "tracked_invites": 10
}

// Funções sem guias de configuração
const direct_functions = [1, 7, 10]

module.exports = async ({ client, user, interaction, operador, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id), pagina = pagina_guia || 0
    const membro_sv = await client.getMemberGuild(interaction, interaction.user.id)

    // Códigos de funções
    // 0 -> Alon falador
    // 1 -> Broadcast
    // 2 -> Free games

    // 3 -> Tickets de denúncia
    // 4 -> Reportes externos
    // 5 -> Log de Eventos

    // 6 -> Anti-spam
    // 7 -> Visibilidade global
    // 8 -> Network


    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "manu.painel.cabecalho_menu_servidor")} :globe_with_meridians:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "manu.painel.descricao"))
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        embed.addFields(
            {
                name: `${emoji_button(guild?.conf.logger)} **${client.tls.phrase(user, "manu.painel.log_eventos")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_logger")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.spam)} **${client.tls.phrase(user, "manu.painel.anti_spam")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_spam")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.games)} **${client.tls.phrase(user, "manu.painel.anuncio_games")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_games")}\``,
                inline: true
            }
        )

    if (pagina == 1)
        embed.addFields(
            {
                name: `${emoji_button(guild?.conf.network)} **Network**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_network")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.reports)} **${client.tls.phrase(user, "manu.painel.reports_externos")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_reports")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.tickets)} **${client.tls.phrase(user, "manu.painel.denuncias_server")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_denuncias")}\``,
                inline: true
            }
        )

    if (pagina == 2)
        embed.addFields(
            {
                name: `${emoji_button(guild?.conf.warn)} **${client.tls.phrase(user, "mode.warn.advertencias")}**`,
                value: `\`${client.tls.phrase(user, "mode.warn.desc_advertencias")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.conversation)} **${client.tls.phrase(user, "manu.painel.alonsal_falador")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_falador")}\``,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.nuke_invites)} **Convites rastreados**`,
                value: `\`Apaga os convites de membros quando forem banidos e expulsos.\``,
                inline: true
            }
        )

    if (pagina === 3)
        embed.addFields(
            {
                name: `${emoji_button(guild?.conf.public)} **${client.tls.phrase(user, "manu.painel.visibilidade_global")}**`,
                value: `${client.tls.phrase(user, "manu.painel.desc_global")}`,
                inline: true
            },
            {
                name: `${emoji_button(guild?.conf.broadcast)} **${client.tls.phrase(user, "manu.painel.permitir_broadcast")}**`,
                value: `${client.tls.phrase(user, "manu.painel.desc_broadcast")}`,
                inline: true
            },
            {
                name: `${emoji_button(0)} **${client.tls.phrase(user, "manu.painel.misterioso")}**`,
                value: `\`${client.tls.phrase(user, "manu.painel.desc_misterioso")}\``,
                inline: true
            }
        )

    const c_buttons = [false, false, false, false, false, false, false, false, false, false, false]
    const c_menu = [false, false]

    if (pagina == 0) // Botão de voltar
        c_menu[0] = true
    if (pagina == 3) // Botão para avançar
        c_menu[1] = true

    let botoes = [{ id: "navigation_button_panel", name: '◀️', type: 0, data: `${pagina}.0.panel_guild`, disabled: c_menu[0] }]

    // Falta de permissões para gerenciar o sistema de denúncias
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && !membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))
        c_buttons[3] = true

    // Falta de permissões para gerenciar o sistema de reportes, o alon falador, o broadcast entre servidores
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
        c_buttons[10] = true
    }

    // Falta de permissões para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers || PermissionsBitField.Flags.KickMembers)) {
        c_buttons[8] = true
        c_buttons[9] = true
    }

    if (operador) // Verificando se o usuário possui permissão e ativando a função escolhida
        if (c_buttons[operation_codes[operador]])
            return client.tls.reply(interaction, user, "manu.painel.user_sem_permissao", 7)
        else {

            if (direct_functions.includes(operation_codes[operador])) { // Funções sem guia de configuração
                const dados = `${interaction.user.id}.${operation_codes[operador]}`
                return require('../functions/buttons/guild_panel_button')({ client, user, interaction, dados })
            } else { // Acessando diretamente uma guia de função

                let pagina_guia = 0

                if (operador.includes(".")) {
                    pagina_guia = parseInt(operador.split(".")[1])
                    operador = operador.split(".")[0]
                }

                return require(`./panel_guild_${operador}`)({ client, user, interaction, pagina_guia })
            }
        }

    // Primeira página de botões de configuração do Alon
    // Log de eventos, Anti-spam e Anúncio de games
    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_logger_button", name: client.tls.phrase(user, "manu.painel.log_eventos"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[5] },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "manu.painel.anti_spam"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[6] },
            { id: "guild_free_games_button", name: client.tls.phrase(user, "manu.painel.anuncio_games"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[2] }
        ])

    // Segunda página de botões de configuração do Alon
    // Denúncias in-server; Reportes externos e AutoBan
    if (pagina === 1)
        botoes = botoes.concat([
            { id: "guild_network_button", name: "Network", type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[8] },
            { id: "guild_reports_button", name: client.tls.phrase(user, "manu.painel.reports_externos"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[4] },
            { id: "guild_tickets_button", name: client.tls.phrase(user, "manu.painel.denuncias_server"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[3] }
        ])

    // Terceira página de botões de configuração do Alon
    // Advertências; Alon Falador e Visibilidade Global
    if (pagina === 2)
        botoes = botoes.concat([
            { id: "guild_warns_button", name: "Advertências", type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[9] },
            { id: "guild_speaker_button", name: client.tls.phrase(user, "manu.painel.alonsal_falador"), type: 1, emoji: client.emoji(41), data: '0', disabled: c_buttons[0] },
            { id: "guild_panel_button", name: "Convites rastreados", type: type_button(guild?.conf.nuke_invites), emoji: emoji_button(guild?.conf.nuke_invites), data: '9', disabled: c_buttons[10] }
        ])

    // Broadcast
    if (pagina === 3)
        botoes = botoes.concat([
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.visibilidade_global"), type: type_button(guild?.conf.public), emoji: emoji_button(guild?.conf.public), data: '7', disabled: c_buttons[7] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.permitir_broadcast"), type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: '1', disabled: c_buttons[1] },
            { id: "guild_panel_button", name: client.tls.phrase(user, "manu.painel.misterioso"), type: type_button(0), emoji: emoji_button(3), data: '2', disabled: true }
        ])

    botoes.push({ id: "navigation_button_panel", name: '▶️', type: 0, data: `${pagina}.1.panel_guild`, disabled: c_menu[1] })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}