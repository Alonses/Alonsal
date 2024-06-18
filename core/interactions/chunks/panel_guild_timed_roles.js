const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { defaultRoleTimes } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Permissões do bot no servidor
    const bot_member = await client.getMemberGuild(interaction, client.id())

    // Desabilitando os tickets caso o bot não possa gerenciar os canais e cargos do servidor
    if (!bot_member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
        guild.conf.timed_roles = false
        await guild.save()
    }

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.timed_roles.titulo_painel")} :passport_control: ${client.defaultEmoji("time")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.timed_roles.descricao_painel"))
        .setFields(
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
                value: guild.timed_roles.timeout ? `\`${client.tls.phrase(user, `menu.times.${defaultRoleTimes[guild.timed_roles.timeout]}`)}\`` : `\`${client.tls.phrase(user, "mode.timed_roles.sem_expiracao")}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} ${guild.timed_roles.channel ? `\`${guild.timed_roles.channel}\`\n( <#${guild.timed_roles.channel}> )` : "`Sem canal definido`"}`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: false },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", bot_member.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.moderar_membros")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", bot_member.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const botoes = [
        { id: "guild_timed_roles_button", name: "Expiração", type: 1, emoji: client.defaultEmoji("time"), data: "1" },
        { id: "guild_timed_roles_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "2" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }], interaction)],
        ephemeral: true
    })
}