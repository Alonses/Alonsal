const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const pagina = pagina_guia || 0

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }], strikes = ""

    if (pagina === 1) // 2° página da guia do Anti-spam
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.0" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando o anti-spam caso o bot não possa castigar os membros do servidor
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        guild.conf.spam = false

    // Desabilitando os strickes caso o bot não possa expulsar membros do servidor
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))
        guild.spam.strikes = false

    await guild.save()

    if (guild?.spam.strikes) {
        strikes = client.tls.phrase(user, "mode.spam.strikes")

        if (!guild.spam.data)
            strikes += client.tls.phrase(user, "mode.spam.strikes_ativo")

        strikes = `\`\`\`${strikes}\`\`\`\n`
    } else
        strikes = client.tls.phrase(user, "mode.spam.strikes_desativado")

    const embed = new EmbedBuilder()
        .setTitle("> Anti-spam 📛")
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${emoji_button(guild?.conf.spam)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${emoji_button(guild?.spam.strikes)} **Strikes**\n${emoji_button(guild?.spam.suspicious_links)} **Links suspeitos**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.spam.tempo")}:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.spam.timeout]}`)}\``,
                value: `${client.emoji(47)} **Repetecos:** \`${guild.spam.trigger_amount}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.logger.channel}\`\n( <#${guild.logger.channel}> )`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ManageMessages))} **${client.tls.phrase(user, "mode.network.gerenciar_mensagens")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (strikes !== "") // Texto dos valores de strikes
        embed.setDescription(strikes)

    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "manu.painel.anti_spam"), type: type_button(guild?.conf.spam), emoji: emoji_button(guild?.conf.spam), data: "1" },
            { id: "guild_anti_spam_button", name: "Strikes", type: type_button(guild?.spam.strikes), emoji: emoji_button(guild?.spam.strikes), data: "2" },
            { id: "guild_anti_spam_button", name: "Links suspeitos", type: type_button(guild?.spam.suspicious_links), emoji: emoji_button(guild?.spam.suspicious_links), data: "3" },
            { id: "guild_anti_spam_button", name: "Ajustes", type: 1, emoji: client.emoji(41), data: "9" }
        ])
    else // 2° página da guia do Anti-spam
        botoes = botoes.concat([
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.spam.tempo_minimo"), type: 1, emoji: client.defaultEmoji("time"), data: "4" },
            { id: "guild_anti_spam_button", name: "Repetecos", type: 1, emoji: client.emoji(47), data: "5" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "6" }
        ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}