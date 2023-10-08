const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.report.reportes_externos")} ${client.defaultEmoji("guard")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.report.funcionamento_reportes"))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.reports)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${emoji_button(guild?.reports.notify)} **${client.tls.phrase(user, "mode.report.aviso_de_entradas")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.reports.channel}\`\n( <#${guild.reports.channel}> )`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "reports_button", name: client.tls.phrase(user, "manu.painel.reports_externos"), type: type_button(guild?.conf.reports), emoji: emoji_button(guild?.conf.reports), data: "1" },
        { id: "reports_button", name: client.tls.phrase(user, "mode.report.aviso_de_entradas"), type: type_button(guild?.reports.notify), emoji: emoji_button(guild?.reports.notify), data: "2" },
        { id: "reports_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "3" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}