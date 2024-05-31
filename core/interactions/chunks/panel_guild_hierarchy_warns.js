const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { listAllGuildWarns } = require("../../database/schemas/Guild_warns")

const { defaultEraser } = require('../../formatters/patterns/timeout')
const { default_emoji } = require('../../../files/json/text/emojis.json')

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [], texto_rodape = client.tls.phrase(user, "manu.painel.rodape")

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())
    const advertencias = await listAllGuildWarns(interaction.guild.id)

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "mode.warn.advertencias")} com hirarquia :crown: :octagonal_sign:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Advertências hierárquicas\n\nSão mini-advertências que funcionam como anotações. Ative elas para poder registrar anotações sem penalidades, defina o número de anotações que cada advertência precisará para ser ativa e deixe com que o Alonsal registre durante o tempo os casos que ocorrerem.\n\nVocê pode definir uma quantidade fixa de anotações que cada advertência nova precisará, definir um canal onde eu irei enviar a solicitação de aplicação da penalidade, e escolher se as anotações também irão se expirar após um tempo.```")
        .setFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", guild.warn.hierarchy.status)} **Usar hierarquia**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", guild.warn.hierarchy.timed)} **${client.tls.phrase(user, "mode.warn.com_validade")}**\n${client.emoji(47)} **Anotações: \`${guild.warn.hierarchy.strikes}\`**\n${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias")}: \`${advertencias.length} / 5\`**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **Painel de controle**`,
                value: `${guild.warn.hierarchy.channel ? `${client.emoji("icon_id")} \`${guild.warn.hierarchy.channel}\`\n( <#${guild.warn.hierarchy.channel}> )` : `\`${client.tls.phrase(user, "mode.network.sem_canal")}\``}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.warn.validade")}**`,
                value: `:wastebasket: **${client.tls.phrase(user, "mode.warn.expira_em")} \`${client.tls.phrase(user, `menu.times.${defaultEraser[guild.warn.hierarchy.reset]}`)}\`**${guild.warn.hierarchy.timed ? "" : `\n( **⛔ ${client.tls.phrase(user, "mode.warn.no_momento")}** )`}`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji(7)} **${client.tls.phrase(user, "mode.network.permissoes_no_servidor")}**`,
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers))} **${client.tls.phrase(user, "mode.network.castigar_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles))} **${client.tls.phrase(user, "mode.network.gerenciar_cargos")}**`,
                inline: true
            },
            {
                name: "⠀",
                value: `${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers))} **${client.tls.phrase(user, "mode.network.banir_membros")}**\n${client.execute("functions", "emoji_button.emoji_button", membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers))} **${client.tls.phrase(user, "mode.network.expulsar_membros")}**`,
                inline: true
            }
        )
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_hierarchy_warns_button", name: "Usar hierarquia", type: client.execute("functions", "emoji_button.type_button", guild.warn.hierarchy.status), emoji: client.execute("functions", "emoji_button.emoji_button", guild.warn.hierarchy.status), data: "1", disabled: !guild.warn.hierarchy.channel },
        { id: "guild_hierarchy_warns_button", name: client.tls.phrase(user, "mode.warn.com_validade"), type: client.execute("functions", "emoji_button.type_button", guild.warn.hierarchy.timed), emoji: client.execute("functions", "emoji_button.emoji_button", guild.warn.hierarchy.timed), data: "2" },
        { id: "guild_hierarchy_warns_button", name: "Avisos prévios", type: 1, emoji: default_emoji["numbers"][guild.warn.hierarchy.strikes], data: "4" }
    ])

    const row = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.0" },
        { id: "guild_hierarchy_warns_button", name: "Painel de controle", type: 1, emoji: client.defaultEmoji("telephone"), data: "5" },
        { id: "guild_hierarchy_warns_button", name: "Expiração", type: 1, emoji: client.defaultEmoji("time"), data: "6" }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
        ephemeral: true
    })
}