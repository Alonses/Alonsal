const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { getNetworkedGuilds } = require("../../database/schemas/Guild")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    try {
        await client.deferedResponse({ interaction })

        const pagina = pagina_guia || 0
        const guild = await client.getGuild(interaction.guild.id)
        let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]
        let retorno_aviso = ""

        if (pagina === 1) // 2° página da guia do networking
            botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_network.0" }]

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

        await guild.save()

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

        const embed = new EmbedBuilder()
            .setTitle(`> Networking ${client.emoji(36)}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.network.descricao"))
            .setFields(
                {
                    name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.network)} **${client.tls.phrase(user, "mode.report.status")}**`,
                    value: `${client.emoji(32)} **${client.tls.phrase(user, "mode.network.servidores")} no link: ${servidores_link}**`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.network.eventos_sincronizados")}**`,
                    value: `\`${eventos.ativos} / ${eventos.total}\``,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                    value: `${guild.network.channel ? `${client.emoji("icon_id")} \`${guild.network.channel}\`\n( <#${guild.network.channel}> )` : `\`${client.tls.phrase(user, "mode.network.sem_canal")}\``}${guild.logger.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                    inline: true
                }
            )

        if (servidores_link > 1) // Network com mais de um servidor
            embed.addFields(
                {
                    name: `:link: **${client.tls.phrase(user, "manu.guild_data.outros_servidores")}:**`,
                    value: guild.network.link ? await client.getNetWorkGuildNames(guild.network.link, interaction) : client.tls.phrase(user, "manu.guild_data.sem_servidores"),
                    inline: false
                }
            )

        embed.addFields(
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
            .setFooter({
                text: client.tls.phrase(user, "manu.painel.rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        if (pagina === 0)
            botoes = botoes.concat([
                { id: "guild_network_button", name: "Network", type: client.execute("functions", "emoji_button.type_button", guild?.conf.network), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.network), data: "1" },
                { id: "guild_network_button", name: client.tls.phrase(user, "mode.network.eventos_sincronizados"), type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
                { id: "guild_network_button", name: client.tls.phrase(user, "mode.network.servidores"), type: 1, emoji: client.emoji(32), data: "3" },
                { id: "guild_network_button", name: client.tls.phrase(user, "menu.botoes.ajustes"), type: 1, emoji: client.emoji(41), data: "9" }
            ])
        else {
            botoes = botoes.concat([
                { id: "guild_network_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" },
            ])

            if (servidores_link > 1) // Network com mais de um servidor
                botoes = botoes.concat([{ id: "guild_network_button", name: client.tls.phrase(user, "mode.network.quebrar_vinculo"), type: 1, emoji: client.emoji(44), data: "4" }])
        }

        interaction.editReply({
            content: retorno_aviso,
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } catch (err) {
        console.log(err)
    }
}