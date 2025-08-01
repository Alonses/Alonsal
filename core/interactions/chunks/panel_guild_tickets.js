const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando os tickets caso o bot não possa gerenciar os canais e cargos do servidor
    if (!membro_sv.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
        guild.conf.tickets = false
        await guild.save()
    }

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.denuncias_server")} ${client.defaultEmoji("guard")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.ticket.descricao"))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.tickets)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${client.decifer(guild.tickets.category)}\`\n( <#${client.decifer(guild.tickets.category)}> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels))} **${client.tls.phrase(user, "mode.network.gerenciar_canais")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const botoes = [
        { id: "guild_tickets_button", name: client.tls.phrase(user, "manu.painel.denuncias_server"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.tickets), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.tickets), data: "1" },
        { id: "guild_tickets_button", name: client.tls.phrase(user, "util.server.categoria"), type: 1, emoji: client.defaultEmoji("channel"), data: "2" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }], interaction)],
        flags: "Ephemeral"
    })
}