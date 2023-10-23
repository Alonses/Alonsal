const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { getNetworkedGuilds } = require("../../database/schemas/Guild")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    // Permissões do bot no servidor
    const servidores = await getNetworkedGuilds(guild.network.link)
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

    await guild.save()


    const eventos = {
        total: 0,
        ativos: 0
    }

    Object.keys(guild.network).forEach(evento => {
        if (evento !== "link") {
            if (guild.network[evento])
                eventos.ativos++ // Apenas eventos ativos

            eventos.total++
        }
    })

    const embed = new EmbedBuilder()
        .setTitle(`> Networking ${client.defaultEmoji("earth")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.network.descricao"))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.network)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.emoji(45)} **${client.tls.phrase(user, "mode.network.servidores")}: ${servidores.length}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.network.eventos_sincronizados")}**`,
                value: `\`${eventos.ativos} / ${eventos.total}\``,
                inline: true
            },
            {
                name: "⠀",
                value: "⠀",
                inline: false
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog))} **${client.tls.phrase(user, "mode.network.registro_auditoria")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_network_button", name: "Network", type: type_button(guild?.conf.network), emoji: emoji_button(guild?.conf.network), data: "1" },
        { id: "guild_network_button", name: client.tls.phrase(user, "mode.network.eventos_sincronizados"), type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
        { id: "guild_network_button", name: client.tls.phrase(user, "mode.network.servidores"), type: 1, emoji: client.emoji(45), data: "3" },
        { id: "guild_network_button", name: client.tls.phrase(user, "mode.network.quebrar_vinculo"), type: 1, emoji: client.emoji(44), data: "4" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}