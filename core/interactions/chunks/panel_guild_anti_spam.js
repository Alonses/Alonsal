const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { listAllGuildStrikes } = require("../../database/schemas/Strikes_guild")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const pagina = pagina_guia || 0

    const guild = await client.getGuild(interaction.guild.id)
    const strikes_guild = await listAllGuildStrikes(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }]

    if (pagina > 0) // 2° página da guia do Anti-spam
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.0" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let indice_matriz

    strikes_guild.forEach(strike => {

        // Desabilitando o anti-spam caso o bot não possa banir membros e o strike seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers) && strike.action === "member_mute") || strikes_guild.length < 1)
            guild.conf.spam = false

        // Desabilitando o anti-spam caso o bot não possa banir membros e o strike seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers) && strike.action === "member_kick_2") || strikes_guild.length < 1)
            guild.conf.spam = false

        // Desabilitando o anti-spam caso o bot não possa banir membros e o strike seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers) && strike.action === "member_ban") || strikes_guild.length < 1)
            guild.conf.spam = false

        if ((strike.action === "member_kick_2" || strike.action === "member_ban") && !indice_matriz)
            indice_matriz = strike.rank + 1
    })

    // Desabilitando os strikes caso não haja canais de aviso selecionados
    if (!guild.spam.channel && !guild.logger.channel)
        guild.conf.spam = false

    await guild.save()

    let descricao = client.tls.phrase(user, "mode.spam.descricao_funcionamento")

    if (guild?.spam.strikes) // Strikes do servidor
        descricao += client.tls.phrase(user, "mode.spam.strikes_ativo")
    else
        descricao += client.tls.phrase(user, "mode.spam.strikes_desativado")

    if (guild?.spam.manage_mods) // Gerenciamento de moderadores
        descricao += client.tls.phrase(user, "mode.spam.moderadores_ativo")
    else
        descricao += client.tls.phrase(user, "mode.spam.moderadores_desativado")

    const embed = new EmbedBuilder()
        .setTitle("> Anti-spam 📛")
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild?.conf.spam)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild?.spam.strikes)} **Strikes**\n${client.execute("functions", "emoji_button.emoji_button", guild?.spam.suspicious_links)} **${client.tls.phrase(user, "mode.spam.links_suspeitos")}**\n${client.execute("functions", "emoji_button.emoji_button", guild?.spam.manage_mods)} **${client.tls.phrase(user, "mode.spam.gerenciar_moderadores")}**`,
                inline: true
            },
            {
                name: `${client.emoji(64)} **Strikes:** \`${strikes_guild.length} / 5\`${indice_matriz ? `\n${client.emoji(54)} **${client.tls.phrase(user, "mode.spam.expulsao_em")} \`${indice_matriz}°\`**` : ""}`,
                value: `${client.emoji(47)} **Repetecos:** \`${guild.spam.trigger_amount}\`\n${client.emoji(20)} ${client.execute("functions", "emoji_button.emoji_button", guild?.spam.notify)} **${client.tls.phrase(user, "mode.spam.mencoes")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${guild.spam.channel ? `\n${client.emoji("icon_id")} \`${guild.spam.channel}\`\n( <#${guild.spam.channel}> )` : `\n\`${client.tls.phrase(user, "mode.network.sem_canal")}\``}${guild.logger.channel && !guild.spam.channel ? `\n${client.emoji(49)} ( <#${guild.logger.channel}> )` : ""}`,
                inline: true
            }
        )

    if (guild?.spam.manage_mods) // Recurso para gerenciar moderadores habilitado
        embed.addFields(
            {
                name: `${client.emoji(56)} ${client.tls.phrase(user, "mode.spam.posicionamento", null, membro_sv.roles.highest.position)}`,
                value: client.tls.phrase(user, "mode.spam.posicionamento_cargo", 60),
                inline: false
            })

    embed.addFields(
        {
            name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
            value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageMessages))} **${client.tls.phrase(user, "mode.network.gerenciar_mensagens")}**`,
            inline: true
        },
        {
            name: "⠀",
            value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
            inline: true
        }
    )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (descricao !== "") // Texto dos valores de strikes
        embed.setDescription(`\`\`\`${descricao}\`\`\``)

    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "manu.painel.anti_spam"), type: client.execute("functions", "emoji_button.type_button", guild?.conf.spam), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.spam), data: "1" },
            { id: "guild_anti_spam_button", name: "Strikes", type: client.execute("functions", "emoji_button.type_button", guild?.spam.strikes), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.spam.strikes), data: "2" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "menu.botoes.recursos"), type: 1, emoji: client.emoji(41), data: "10" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "menu.botoes.ajustes"), type: 1, emoji: client.emoji(41), data: "9" }
        ])
    else if (pagina === 1) // Página de recursos do Anti-spam ( Links suspeitos, punição de adms )
        botoes = botoes.concat([
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.spam.gerenciar_moderadores"), type: client.execute("functions", "emoji_button.type_button", guild?.spam.manage_mods), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.spam.manage_mods), data: "8" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.spam.links_suspeitos"), type: client.execute("functions", "emoji_button.type_button", guild?.spam.suspicious_links), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.spam.suspicious_links), data: "3" }
        ])
    else // Página de configurações do Anti-spam
        botoes = botoes.concat([
            { id: "guild_anti_spam_button", name: "Strikes", type: 1, emoji: client.defaultEmoji("guard"), data: "4" },
            { id: "guild_anti_spam_button", name: "Repetecos", type: 1, emoji: client.emoji(47), data: "5" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.spam.mencoes"), type: client.execute("functions", "emoji_button.type_button", guild?.spam.notify), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.spam.notify), data: "7" },
            { id: "guild_anti_spam_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "6" }
        ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}