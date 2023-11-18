const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }], row

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers) && guild.warn.action === "member_mute")
        guild.conf.warn = false

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers) && guild.warn.action === "member_kick")
        guild.conf.warn = false

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers) && guild.warn.action === "member_ban")
        guild.conf.warn = false

    if (!guild.conf.warn)
        await guild.save()

    const embed = new EmbedBuilder()
        .setTitle(`> Advertências :octagonal_sign:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Funcionamento do sistema de advertências\n\nEsse sistema registra advertências a longo prazo criado pelos moderadores do servidor, ao criar várias advertências para um usuário, se esse usuário atingir o limite de advertências, uma penalidade será aplicada!\n\nVocê pode definir qual será a penalidade, a quantidade de advertências requeridas e o tempo de mute (caso decida por mutar um usuário) pelos botões abaixo.```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.warn)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.repetencias")}: \`${guild.warn.cases}\`**`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "mode.warn.penalidade_aplicada")}**`,
                value: `\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`${client.guildAction(guild, user)}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.warn.channel}\`\n( <#${guild.warn.channel}> )`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.advertencia"), type: type_button(guild?.conf.warn), emoji: emoji_button(guild?.conf.warn), data: "1" },
        { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.penalidade"), type: 1, emoji: client.defaultEmoji("warn"), data: "3" }
    ])

    // Apenas aparece se o tipo de punição for definido como mute
    if (guild.warn.action === "member_mute")
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.spam.tempo"), type: 1, emoji: client.defaultEmoji("telephone"), data: "2" }
        ])

    botoes = botoes.concat([
        { id: "guild_warns_button", name: client.tls.phrase(user, "mode.warn.repetencias"), type: 1, emoji: client.emoji(47), data: "4" }
    ])

    if (botoes.length < 5)
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" }
        ])
    else
        row = client.create_buttons([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" }
        ], interaction)

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    }

    if (row) // Botão extra para selecionar o canal
        obj.components.push(row)

    client.reply(interaction, obj)
}