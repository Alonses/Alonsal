const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { languagesMap } = require("../../formatters/patterns/user")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id), pagina = pagina_guia || 0
    const idioma = guild.lang !== "al-br" ? `:flag_${guild.lang.slice(3, 5)}:` : ":pirate_flag:"

    let botoes = [], descr_rodape

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando o log de eventos caso o bot não possa ver o registro de auditoria do servidor
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
        guild.conf.logger = false
        await guild.save()

        descr_rodape = client.tls.phrase(user, "mode.logger.falta_registro_auditoria", 7)
    }

    const eventos = {
        total: 0,
        ativos: 0
    }

    if (pagina !== 2)
        Object.keys(guild.logger).forEach(evento => {
            if (evento !== "channel") {
                if (guild.logger[evento])
                    eventos.ativos++ // Apenas eventos ativos

                eventos.total++
            }
        })

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.log_eventos")} :scroll:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.logger.descricao"))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.logger)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.death_note.note)} **Death note**\n${idioma} **${client.tls.phrase(user, "mode.anuncio.idioma")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.logger.eventos_ouvidos")}**`,
                value: `\`${eventos.ativos} / ${eventos.total}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.logger.channel}\`\n( <#${guild.logger.channel}> )`,
                inline: true
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog))} **${client.tls.phrase(user, "mode.network.registro_auditoria")}**`,
                inline: false
            }
        )
        .setFooter({
            text: descr_rodape || client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 2) {

        const eventos_note = {
            total: 0,
            ativos: 0
        }

        Object.keys(guild.death_note).forEach(evento => {
            if (evento.includes("member_")) {
                if (guild.death_note[evento])
                    eventos_note.ativos++ // Apenas eventos ativos

                eventos_note.total++
            }
        })

        embed.setTitle(client.tls.phrase(user, "mode.death_note.titulo"))
            .setDescription(client.tls.phrase(user, "mode.death_note.descricao"))
            .setFields(
                {
                    name: `${client.execute("functions", "emoji_button.emoji_button", guild?.death_note.note)} **Death note**`,
                    value: `${client.emoji(20)} ${client.execute("functions", "emoji_button.emoji_button", guild?.death_note.notify)} **${client.tls.phrase(user, "menu.botoes.notificacoes")}**`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.logger.eventos_ouvidos")}**`,
                    value: `\`${eventos_note.ativos} / ${eventos_note.total}\``,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                    value: guild.death_note.channel ? `${client.emoji("icon_id")} \`${guild.death_note.channel}\`\n( <#${guild.death_note.channel}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``,
                    inline: true
                }
            )
    }

    if (pagina === 0)
        botoes.push(
            { id: "guild_logger_button", name: { tls: "manu.painel.log_eventos", alvo: user }, type: client.execute("functions", "emoji_button.type_button", guild?.conf.logger), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.logger), data: "1", disabled: !membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog) },
            { id: "guild_logger_button", name: { tls: "mode.logger.eventos_ouvidos", alvo: user }, type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
            { id: "guild_logger_button", name: "Death note", type: 1, emoji: client.emoji(41), data: "10" },
            { id: "guild_logger_button", name: { tls: "menu.botoes.ajustes", alvo: user }, type: 1, emoji: client.emoji(41), data: "9" }
        )
    else if (pagina === 1)
        botoes.push(
            { id: "guild_logger_button", name: { tls: "mode.report.canal_de_avisos", alvo: user }, type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
            { id: "guild_logger_button", name: { tls: "mode.anuncio.idioma", alvo: user }, type: 1, emoji: languagesMap[guild.lang.slice(0, 2)][3], data: "4" }
        )
    else
        botoes.push(
            { id: "guild_logger_button", name: "Death note", type: client.execute("functions", "emoji_button.type_button", guild?.death_note.note), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.death_note.note), data: "5" },
            { id: "guild_logger_button", name: { tls: "menu.botoes.notificacoes", alvo: user }, type: client.execute("functions", "emoji_button.type_button", guild?.death_note.notify), emoji: client.emoji(20), data: "7" },
            { id: "guild_logger_button", name: { tls: "mode.logger.eventos_ouvidos", alvo: user }, type: 1, emoji: client.defaultEmoji("warn"), data: "6" },
            { id: "guild_logger_button", name: { tls: "mode.report.canal_de_avisos", alvo: user }, type: 1, emoji: client.defaultEmoji("channel"), data: "8" },
        )

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons([{ id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: pagina < 1 ? "panel_guild.0" : "panel_guild_logger.0" }], interaction)],
        flags: "Ephemeral"
    })
}