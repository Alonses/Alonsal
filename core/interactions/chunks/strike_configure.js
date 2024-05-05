const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button } = require("../../functions/emoji_button")

const { getGuildStrike } = require("../../database/schemas/Guild_strikes")

const { loggerMap } = require("../../formatters/patterns/guild")
const { spamTimeoutMap } = require("../../formatters/patterns/timeout")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_strike = dados.split(".")[2]
    const guild = await client.getGuild(interaction.guild.id)
    const strike = await getGuildStrike(interaction.guild.id, id_strike)

    const embed = new EmbedBuilder()
        .setTitle(`> Strike N° ${strike.rank + 1} 📛`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.tls.phrase(user, "mode.spam.descricao_edicao_strike"))
        .setFields(
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
                name: `${client.emoji(53)} **${client.tls.phrase(user, "menu.botoes.tempo_mute")}**`,
                value: `**${strike.timeout != null ? `${client.defaultEmoji("time")} \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[strike.timeout]}`)}\`` : client.tls.phrase(user, "mode.spam.sem_tempo_definido")}**`,
                inline: true
            }
        )

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let b_cargos = false

    embed.addFields(
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
        {
            name: "⠀",
            value: "⠀",
            inline: true
        }
    )

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
        { id: "strike_configure_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: `4.${id_strike}` },
        { id: "strike_configure_button", name: client.tls.phrase(user, "menu.botoes.penalidade"), type: 1, emoji: loggerMap[strike.action] || loggerMap["none"], data: `1.${id_strike}` },
        { id: "strike_configure_button", name: client.tls.phrase(user, "mode.anuncio.cargo"), type: 1, emoji: client.defaultEmoji("role"), data: `2.${id_strike}`, disabled: b_cargos },
        { id: "strike_configure_button", name: client.tls.phrase(user, "menu.botoes.tempo_mute"), type: 1, emoji: client.defaultEmoji("time"), data: `3.${id_strike}` }
    ]

    const row = [
        { id: "guild_anti_spam_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "4" },
        { id: "strike_remove", name: client.tls.phrase(user, "menu.botoes.excluir_strike"), type: 3, emoji: client.emoji(13), data: `2|${id_strike}` }
    ]

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
        ephemeral: true
    }

    client.reply(interaction, obj)
}