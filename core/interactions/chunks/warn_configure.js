const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button } = require("../../functions/emoji_button")

const { loggerMap } = require("../../database/schemas/Guild")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")
const { getGuildWarn } = require("../../database/schemas/Warns_guild")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_warn = dados.split(".")[2]
    const guild = await client.getGuild(interaction.guild.id)
    const warn = await getGuildWarn(interaction.guild.id, id_warn)

    const embed = new EmbedBuilder()
        .setTitle(`> Advertência N° ${warn.rank + 1} :pencil:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```💂‍♂️ Defina regras para essa advertência, membros que forem advertidos receberão o que estiver definido por aqui!```")
        .setFields(
            {
                name: `${client.defaultEmoji("warn")} **Punição**`,
                value: `**${warn.action ? `${loggerMap[warn.action]} \`${client.tls.phrase(user, `menu.events.${warn.action}`)}\`` : "📝 `Sem penalidade`"}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("role")} **Cargo**`,
                value: `**${warn.role ? `<@&${warn.role}>` : "`Sem cargo`"}**`,
                inline: true
            },
            {
                name: `${client.emoji(53)} **Tempo de mute**`,
                value: `**${warn.timeout != null ? `${client.defaultEmoji("time")} \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[warn.timeout]}`)}\`` : "Sem tempo definido"}**`,
                inline: true
            }
        )

    if (guild.warn.reset)
        embed.addFields(
            {
                name: `${client.defaultEmoji("time")} **Expiração**`,
                value: `**Expira em \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**`,
                inline: false
            }
        )

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    let b_cargos = false

    embed.addFields(
        {
            name: `${client.emoji(7)} **Permissões neste servidor**`,
            value: `${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${emoji_button(membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **Gerenciar cargos**`,
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

    if (warn.role)
        embed.setFooter({
            text: `O cargo mencionado acima será atribuído ao usuário que receber essa advertência.`,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Desabilitando o botão de escolher cargos
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        b_cargos = true

        embed.setFooter({
            text: `Não é possível definir um cargo através das advertências sem a permissão de "Gerenciar cargos" concedida.`,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

        if (warn.role) { // Removendo o cargo definido anteriormente
            warn.role = null
            warn.save()
        }
    }

    const botoes = [
        { id: "warn_configure_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: `4.${id_warn}` },
        { id: "warn_configure_button", name: "Penalidade", type: 1, emoji: loggerMap[warn.action] || loggerMap["none"], data: `1.${id_warn}` },
        { id: "warn_configure_button", name: "Cargo", type: 1, emoji: client.defaultEmoji("role"), data: `2.${id_warn}`, disabled: b_cargos },
        { id: "warn_configure_button", name: "Tempo de mute", type: 1, emoji: client.defaultEmoji("time"), data: `3.${id_warn}` }
    ]

    const row = [
        { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "3" },
        { id: "warn_remove", name: "Excluir advertência", type: 3, emoji: client.emoji(13), data: `2|${id_warn}` }
    ]

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
        ephemeral: true
    }

    client.reply(interaction, obj)
}