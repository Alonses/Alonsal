const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { spamTimeoutMap } = require("../../database/schemas/Strikes")
const { listAllGuildWarns } = require("../../database/schemas/Warns_guild")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const pagina = pagina_guia || 0
    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }]
    let texto_rodape = client.tls.phrase(user, "manu.painel.rodape")

    if (pagina === 1) // 2° página da guia das advertências
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.0" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    const advertencias = await listAllGuildWarns(interaction.guild.id)
    let indice_matriz

    advertencias.forEach(warn => {

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers) && warn.action === "member_mute") || advertencias.length < 1)
            guild.conf.warn = false

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers) && warn.action === "member_kick_2") || advertencias.length < 1)
            guild.conf.warn = false

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers) && warn.action === "member_ban") || advertencias.length < 1)
            guild.conf.warn = false

        if ((warn.action === "member_kick_2" || warn.action === "member_ban") && !indice_matriz)
            indice_matriz = warn.rank + 1
    })

    if (indice_matriz === 1) { // Expulsão ou banimento na 1° advertência
        guild.conf.warn = false
        texto_rodape = client.tls.phrase(user, "mode.warn.aviso_rodape_expulsao")
    }

    if (!guild.conf.warn)
        await guild.save()

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "mode.warn.advertencias")} :octagonal_sign:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.warn.descricao_advertencias"))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.warn)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.warn.timed)} **${client.tls.phrase(user, "mode.warn.com_validade")}**\n${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias")}: \`${advertencias.length} / 5\`**${indice_matriz ? `\n${client.emoji(54)} **${client.tls.phrase(user, "mode.warn.expulsao_na")} \`${indice_matriz}°\`**` : ""}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji(20)} ${client.execute("functions", "emoji_button.emoji_button", guild?.warn.notify)} **${client.tls.phrase(user, "mode.spam.mencoes")}**\n${guild.warn.channel ? `${client.emoji("icon_id")} \`${guild.warn.channel}\`\n( <#${guild.warn.channel}> )` : `\n\`${client.tls.phrase(user, "mode.network.sem_canal")}\``}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.warn.validade")}**`,
                value: `:wastebasket: **${client.tls.phrase(user, "mode.warn.expira_em")} \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**${guild.warn.timed ? "" : `\n( **⛔ ${client.tls.phrase(user, "mode.warn.no_momento")}** )`}`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.warn.advertencias"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.warn), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.warn), data: "1" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.warn.com_validade"), type: client.execute("functions", "emoji_button.type_button", guild?.warn.timed), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.warn.timed), data: "6" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.notificacoes"), type: 1, emoji: client.emoji(41), data: "15" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.ajustes"), type: 1, emoji: client.emoji(41), data: "9" }
        ])
    else
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.warn.advertencias"), type: 1, emoji: client.defaultEmoji("guard"), data: "3" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.expiracao"), type: 1, emoji: client.defaultEmoji("time"), data: "16" }
        ])

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    }

    client.reply(interaction, obj)
}