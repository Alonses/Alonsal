const { PermissionsBitField } = require("discord.js")

const { emoji_button } = require("../../functions/emoji_button")

const { getGuildStrike } = require("../../database/schemas/Guild_strikes")

const { loggerMap } = require("../../formatters/patterns/guild")
const { spamTimeoutMap, defaultRoleTimes } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_strike = dados.split(".")[2]
    const strike = await getGuildStrike(interaction.guild.id, id_strike)

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let b_cargos = false

    const embed = client.create_embed({
        title: `> Strike N° ${strike.rank + 1} 📛`,
        description: { tls: "mode.spam.descricao_edicao_strike" },
        fields: [
            {
                name: `${client.defaultEmoji("warn")} **${client.tls.phrase(user, "menu.botoes.penalidade")}**`,
                value: `**${strike.action ? `${loggerMap[strike.action]} \`${client.tls.phrase(user, `menu.events.${strike.action}`)}\`` : `📝 ${client.tls.phrase(user, "mode.warn.sem_penalidade")}`}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("role")} **${client.tls.phrase(user, "mode.anuncio.cargo")}**`,
                value: `**${strike.role ? `<@&${strike.role}>` : client.tls.phrase(user, "mode.warn.sem_cargo")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.cargo_temporario")}**`,
                value: `**${strike.timed_role.status ? `\`${client.tls.phrase(user, "status.ativo")}\` \`${client.defaultEmoji("time")} ${client.tls.phrase(user, `menu.times.${defaultRoleTimes[strike.timed_role.timeout]}`)}\`` : `\`${client.tls.phrase(user, "status.desativado")}\` \`${client.defaultEmoji("time")} ${client.tls.phrase(user, `menu.times.${defaultRoleTimes[strike.timed_role.timeout]}`)}\``}**`,
                inline: true
            },
            {
                name: `${client.emoji(53)} **${client.tls.phrase(user, "menu.botoes.tempo_mute")}**`,
                value: `**${strike.timeout != null ? `${client.defaultEmoji("time")} \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[strike.timeout]}`)}\`` : client.tls.phrase(user, "mode.spam.sem_tempo_definido")}**`,
                inline: false
            },
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        ]
    }, user)

    if (strike.role)
        embed.setFooter({
            text: client.tls.phrase(user, "mode.spam.cargo_vinculado"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Desabilitando o botão de escolher cargos
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        b_cargos = true

        embed.setFooter({
            text: client.tls.phrase(user, "mode.spam.cargo_permissao"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

        if (strike.role) { // Removendo o cargo definido anteriormente
            strike.role = null
            strike.save()
        }
    }

    const botoes = [
        { id: "strike_configure_button", name: { tls: "menu.botoes.penalidade", alvo: user }, type: 1, emoji: loggerMap[strike.action] || loggerMap["none"], data: `1.${id_strike}` },
        { id: "strike_configure_button", name: { tls: "menu.botoes.tempo_mute", alvo: user }, type: 1, emoji: client.defaultEmoji("time"), data: `3.${id_strike}` },
        { id: "strike_configure_button", name: { tls: "mode.anuncio.cargo", alvo: user }, type: 1, emoji: client.defaultEmoji("role"), data: `2.${id_strike}`, disabled: b_cargos },
        { id: "strike_configure_button", name: { tls: "menu.botoes.cargo_temporario", alvo: user }, type: client.execute("functions", "emoji_button.type_button", strike.timed_role.status), emoji: client.execute("functions", "emoji_button.emoji_button", strike.timed_role.status), data: `20|${id_strike}`, disabled: !strike.role }
    ]

    const row = [
        { id: "guild_anti_spam_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "4" },
        { id: "strike_remove", name: { tls: "menu.botoes.excluir_strike", alvo: user }, type: 3, emoji: client.emoji(13), data: `2|${id_strike}` },
        { id: "strike_configure_button", name: { tls: "menu.botoes.expiracao_cargo", alvo: user }, type: 1, emoji: client.defaultEmoji("time"), data: `21|${id_strike}` }
    ]

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
        flags: "Ephemeral"
    }

    client.reply(interaction, obj)
}