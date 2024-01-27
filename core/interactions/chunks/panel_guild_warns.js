const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

const { spamTimeoutMap } = require("../../database/schemas/Strikes")
const { listAllGuildWarns } = require("../../database/schemas/Warns_guild")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const pagina = pagina_guia || 0
    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }]
    let texto_rodape = client.tls.phrase(user, "manu.painel.rodape")

    if (pagina === 1) // 2° página da guia das advertências
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.0" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    const advertencias = await listAllGuildWarns(interaction.guild.id)
    let indice_matriz

    advertencias.forEach(warn => {

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers) && warn.action === "member_mute") || advertencias.length < 1)
            guild.conf.warn = false

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers) && warn.action === "member_kick_2") || advertencias.length < 1)
            guild.conf.warn = false

        // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
        if ((!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers) && warn.action === "member_ban") || advertencias.length < 1)
            guild.conf.warn = false

        if ((warn.action === "member_kick_2" || warn.action === "member_ban") && !indice_matriz)
            indice_matriz = warn.rank + 1
    })

    if (indice_matriz === 1) { // Expulsão ou banimento na 1° advertência
        guild.conf.warn = false
        texto_rodape = "Os membros estão sendo expulsos da 1° advertência, por gentileza, altere essa configuração para poder ativar esse recurso."
    }

    if (!guild.conf.warn)
        await guild.save()

    const embed = new EmbedBuilder()
        .setTitle(`> Advertências :octagonal_sign:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Funcionamento do sistema de advertências\n\nEsse sistema registra advertências a longo prazo criado pelos moderadores do servidor!\n\nVocê pode definir qual será a penalidade, a quantidade de advertências do servidor e as penalidades pelos botões abaixo.\n\n🧻 Advertência com validade:\nAo ativar esse recurso, as advertências serão removidas após um tempo definido de forma automática, você pode usar esse recurso de modo a não precisar verificar um usuário toda vez, removendo suas advertências manualmente.```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.warn)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${emoji_button(guild?.warn.timed)} **Com validade**\n${client.emoji(47)} **Advertências: \`${advertencias.length}\`**${indice_matriz ? `\n${client.emoji(54)} **Expulsão na \`${indice_matriz}°\`**` : ""}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji(20)} ${emoji_button(guild?.warn.notify)} **Menções**\n${client.emoji("icon_id")} \`${guild.warn.channel ? guild.warn.channel : "Sem canal definido"}\`${guild.warn.channel ? `\n( <#${guild.warn.channel}> )` : ""}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **Validade**`,
                value: `:wastebasket: **Expira em \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**${guild.warn.timed ? "" : "\n( **⛔ no momento** )"}`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **Gerenciar cargos**`,
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
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.advertencias"), type: type_button(guild?.conf.warn), emoji: emoji_button(guild?.conf.warn), data: "1" },
            { id: "guild_warns_button", name: "Com validade", type: type_button(guild?.warn.timed), emoji: emoji_button(guild?.warn.timed), data: "6" },
            { id: "guild_warns_button", name: "Notificações", type: 1, emoji: client.emoji(41), data: "15" },
            { id: "guild_warns_button", name: "Ajustes", type: 1, emoji: client.emoji(41), data: "9" }
        ])
    else
        botoes = botoes.concat([
            { id: "guild_warns_button", name: "Advertências", type: 1, emoji: client.defaultEmoji("guard"), data: "3" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" },
            { id: "guild_warns_button", name: "Expiração", type: 1, emoji: client.defaultEmoji("time"), data: "16" }
        ])

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    }

    client.reply(interaction, obj)
}