const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { getNetworkedGuilds } = require("../../database/schemas/Guild")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    const servidores = await getNetworkedGuilds(guild.network.link)

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

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
        .setDescription("```🧻 Funcionamento do networking\n\nO networking do servidor faz a comunicação dos eventos moderativos deste servidor com outros servidores externos, quando um usuário for castigado por aqui e outros servidores fizerem parte do mesmo network deste servidor, e estiverem com o recurso ativo, o usuário também será castigado por lá!```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.network)} **Status**`,
                value: `:globe_with_meridians: **Servidores: ${servidores.length}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **Eventos sincronizados**`,
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
                name: `${client.emoji(7)} **Permissões neste servidor**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ViewAuditLog))} **Registro de auditória**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **Castigar membros**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **Banir membros**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **Expulsar membros**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_network_button", name: "Network", type: type_button(guild?.conf.network), emoji: emoji_button(guild?.conf.network), data: "1" },
        { id: "guild_network_button", name: "Eventos sincronizados", type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
        { id: "guild_network_button", name: "Servidores", type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
        { id: "guild_network_button", name: "Quebrar vinculo", type: 1, emoji: client.emoji(44), data: "4" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}