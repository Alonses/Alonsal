const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.convites_rastreados")} :link: :busts_in_silhouette:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Funcionamento dos convites rastreados\n\nOs convites rastreados podem ser utilizados para excluir convites criados por membros que forem expulsos ou saírem do servidor de forma automática.\n\nVocê pode alterar o funcionamento dele para remover todos os convites criados por membros quando sairem, ou quando forem expulsos/banidos.```")
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.conf.nuke_invites)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${guild.nuke_invites.channel ? `${client.emoji("icon_id")} \`${guild.nuke_invites.channel}\`\n( <#${guild.nuke_invites.channel}> )` : `\`❌ ${client.tls.phrase(user, "mode.network.sem_canal")}\``}${!guild.nuke_invites.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                inline: true
            },
            {
                name: `:wastebasket: **Remover convites**`,
                value: `\`${!guild.nuke_invites.type ? "👟 Apenas de membros que forem banidos ou expulsos" : "🌟 De qualquer membro que sair do servidor"}\``,
                inline: false
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageGuild))} **${client.tls.phrase(user, "mode.network.gerenciar_servidor")}**`,
                inline: true
            }
        )
        .setFooter({
            text: "⠀",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const botoes = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" },
        { id: "guild_tracked_invites_button", name: client.tls.phrase(user, "manu.painel.convites_rastreados"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.nuke_invites), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.nuke_invites), data: "1" },
        { id: "guild_tracked_invites_button", name: client.tls.phrase(user, "menu.botoes.varredura"), type: 1, emoji: guild.nuke_invites.type ? "🌟" : "👟", data: "2" },
        { id: "guild_tracked_invites_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "3" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}