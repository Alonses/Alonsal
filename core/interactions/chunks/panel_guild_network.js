const { PermissionsBitField } = require("discord.js")

const { getNetworkedGuilds } = require("../../database/schemas/Guild")

const { banMessageEraser } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction, pagina_guia, networkLotado }) => {

    const ephemeral = "Ephemeral"
    await client.deferedResponse({ interaction, ephemeral })

    const pagina = pagina_guia || 0
    const emoji_pessoa = client.defaultEmoji("person")
    const guild = await client.getGuild(interaction.guild.id), botoes = []
    let retorno_aviso = "", ant_network = guild.conf.network

    // Permissões do bot no servidor
    const servidores_link = guild.network.link ? (await getNetworkedGuilds(guild.network.link)).length : 0
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Verificando as permissões necessárias conforme os casos
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog))
        guild.conf.network = false

    if (guild.network.member_ban_add) // Banimentos automaticos
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))
            guild.conf.network = false

    if (guild.network.member_kick) // Expulsões automaticas
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))
            guild.conf.network = false

    if (guild.network.member_punishment) // Castigos automaticos
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            guild.conf.network = false

    if (servidores_link === 1) {
        guild.conf.network = false
        retorno_aviso = client.tls.phrase(user, "mode.network.falta_servidores", 36)
    }

    // Salva os dados atualizados
    if (guild.conf.network !== ant_network) await guild.save()

    const eventos = {
        total: 0,
        ativos: 0
    }

    Object.keys(guild.network).forEach(evento => {
        if (evento !== "link" && evento !== "channel") {
            if (guild.network[evento])
                eventos.ativos++ // Apenas eventos ativos

            eventos.total++
        }
    })

    const embed = client.create_embed({
        title: `> Networking ${client.emoji(36)}`,
        description: { tls: "mode.network.descricao" },
        fields: [
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.network)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.emoji(32)} **${client.tls.phrase(user, "mode.network.servidores_link")}: ${servidores_link}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.network.eventos_sincronizados")}**`,
                value: `\`${eventos.ativos} / ${eventos.total}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${guild.network.channel ? `${client.emoji("icon_id")} \`${guild.network.channel}\`\n( <#${guild.network.channel}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}${guild.logger.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                inline: true
            },
            {
                name: `:wastebasket: **${client.tls.phrase(user, "mode.network.excluir_banidos")}**`,
                value: `\`${client.tls.phrase(user, `menu.network.${banMessageEraser[guild.network.erase_ban_messages]}`)}\` ( :twisted_rightwards_arrows: :globe_with_meridians: )`,
                inline: false
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.network.filtro_acoes")}**`,
                value: `\`${guild.network.scanner.type ? `${emoji_pessoa} ${client.tls.phrase(user, "mode.network.filtro_apenas_humanos")}` : `${client.emoji(5)} ${client.tls.phrase(user, "mode.network.filtro_todas_fontes")}`}\` ( :twisted_rightwards_arrows: :globe_with_meridians: )`,
                inline: false
            }
        ],
        footer: {
            text: { tls: "manu.painel.rodape" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    if (pagina === 2) { // Página com a lista de servidores do network
        embed.setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.network)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.network.eventos_sincronizados")}**`,
                value: `\`${eventos.ativos} / ${eventos.total}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${guild.network.channel ? `${client.emoji("icon_id")} \`${guild.network.channel}\`\n( <#${guild.network.channel}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}${guild.logger.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                inline: true
            },
            {
                name: `:link: **${client.tls.phrase(user, "mode.network.servidores_link")} ( \`${servidores_link} / ${guild.misc?.subscription.active ? 30 : 10}\` )**`,
                value: guild.network.link ? await client.getNetWorkGuildNames(user, guild.network.link, interaction) : client.tls.phrase(user, "manu.guild_data.sem_servidores"),
                inline: false
            }
        )
    } else {
        embed.setFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog))} **${client.tls.phrase(user, "mode.network.registro_auditoria")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            }
        )
    }

    if (pagina === 0)
        botoes.push(
            { id: "guild_network_button", name: "Network", type: client.execute("functions", "emoji_button.type_button", guild?.conf.network), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.network), data: "1" },
            { id: "guild_network_button", name: { tls: "mode.network.eventos_sincronizados" }, type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
            { id: "guild_network_button", name: { tls: "mode.network.servidores" }, type: 1, emoji: client.emoji(32), data: "3" },
            { id: "guild_network_button", name: { tls: "menu.botoes.ajustes" }, type: 1, emoji: client.emoji(41), data: "9" }
        )
    else if (pagina === 1) {
        botoes.push(
            { id: "guild_network_button", name: { tls: "mode.report.canal_de_avisos" }, type: 1, emoji: client.defaultEmoji("channel"), data: "5" },
            { id: "guild_network_button", name: { tls: "menu.botoes.exclusao" }, type: 1, emoji: client.emoji(13), data: "6" }
        )

        if (servidores_link > 1) // Network com mais de um servidor
            botoes.push({ id: "guild_network_button", name: { tls: "mode.network.quebrar_vinculo" }, type: 1, emoji: client.emoji(44), data: "4" })
    }

    // Botões de retorno e estilo de sincronização permitida
    const row = [{ id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: pagina < 1 ? "panel_guild.1" : "panel_guild_network.0" }]

    if (pagina !== 2)
        row.push(
            { id: "guild_network_button", name: { tls: "menu.botoes.ver_network" }, type: 1, emoji: client.emoji(36), data: "12", disabled: servidores_link > 1 ? false : true },
            { id: "guild_network_button", name: { tls: "menu.botoes.filtro_acoes" }, type: 1, emoji: guild.network.scanner.type ? emoji_pessoa : client.emoji("icon_integration"), data: "10" }
        )

    const componentes = []

    if (botoes.length > 0)
        componentes.push(client.create_buttons(botoes, interaction, user))

    if (row.length > 0)
        componentes.push(client.create_buttons(row, interaction, user))

    interaction.editReply({
        content: networkLotado?.length > 0 ? client.tls.phrase(user, "mode.network.limite_servidores", 75, client.list(networkLotado)) : retorno_aviso,
        embeds: [embed],
        components: componentes,
        flags: "Ephemeral"
    })
}