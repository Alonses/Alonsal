const { PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Permissões do bot no servidor
    const membro_sv = await client.execute("getMemberGuild", { interaction, id_user: client.id() })

    const embed = client.create_embed({
        title: `> ${client.tls.phrase(user, "manu.painel.convites_rastreados")} :link: :busts_in_silhouette:`,
        description: { tls: "mode.invites.descricao_funcionamento" },
        fields: [
            {
                name: `${client.execute("button_emoji", guild.conf.nuke_invites)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${guild.nuke_invites.channel ? `${client.emoji("icon_id")} \`${guild.nuke_invites.channel}\`\n( <#${guild.nuke_invites.channel}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}${!guild.nuke_invites.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                inline: true
            },
            {
                name: `:wastebasket: **${client.tls.phrase(user, "mode.invites.remover_convites")}**`,
                value: `\`${!guild.nuke_invites.type ? client.tls.phrase(user, "mode.invites.apenas_banidos") : client.tls.phrase(user, "mode.invites.todas_saidas")}\``,
                inline: false
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("button_emoji", membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild))} **${client.tls.phrase(user, "mode.network.gerenciar_servidor")}**`,
                inline: true
            }
        ],
        footer: {
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    const botoes = [
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "panel_guild.2" },
        { id: "guild_tracked_invites_button", name: { tls: "manu.painel.convites_rastreados" }, type: guild?.conf.nuke_invites, emoji: client.execute("button_emoji", guild?.conf.nuke_invites), data: "1" },
        { id: "guild_tracked_invites_button", name: { tls: "menu.botoes.varredura" }, type: 0, emoji: guild.nuke_invites.type ? "🌟" : "👟", data: "2" },
        { id: "guild_tracked_invites_button", name: { tls: "mode.report.canal_de_avisos" }, type: 0, emoji: client.defaultEmoji("channel"), data: "3" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
    })
}