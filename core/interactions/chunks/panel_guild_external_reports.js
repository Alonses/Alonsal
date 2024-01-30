const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando o AutoBan caso o bot não possa banir os membros do servidor
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        guild.reports.auto_ban = false
        await guild.save()
    }


    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.report.reportes_externos")} ${client.defaultEmoji("guard")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.report.funcionamento_reportes"))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.reports)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.reports.auto_ban)} **AutoBan**\n${client.execute("functions", "emoji_button.emoji_button", guild?.reports.notify)} **${client.tls.phrase(user, "mode.report.aviso_de_entradas")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.reports.channel}\`\n( <#${guild.reports.channel}> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_reports_button", name: client.tls.phrase(user, "manu.painel.reports_externos"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.reports), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.reports), data: "1" },
        { id: "guild_reports_button", name: "AutoBan", type: client.execute("functions", "emoji_button.type_button", guild?.reports.auto_ban), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.reports.auto_ban), data: "2" },
        { id: "guild_reports_button", name: client.tls.phrase(user, "mode.report.aviso_de_entradas"), type: client.execute("functions", "emoji_button.type_button", guild?.reports.notify), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.reports.notify), data: "3" },
        { id: "guild_reports_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "4" }
    ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}