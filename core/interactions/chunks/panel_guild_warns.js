const { EmbedBuilder, PermissionsBitField } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, pagina_guia }) => {

    const pagina = pagina_guia || 0
    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }], row

    if (pagina === 1) // 2° página da guia das advertências
        botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild_warns.0" }]

    // Permissões do bot no servidor
    const membro_sv = await client.getMemberGuild(interaction, client.id())

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ModerateMembers) && (guild.warn.action === "member_mute" || guild.warn.warned === "member_mute"))
        guild.conf.warn = false

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.KickMembers) && (guild.warn.action === "member_kick" || guild.warn.warned === "member_kick"))
        guild.conf.warn = false

    // Desabilitando o log de eventos caso o bot não possa banir membros e o evento seja para banir membros
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.BanMembers) && (guild.warn.action === "member_ban" || guild.warn.warned === "member_ban"))
        guild.conf.warn = false

    if (!guild.conf.warn)
        await guild.save()

    const embed = new EmbedBuilder()
        .setTitle(`> Advertências :octagonal_sign:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Funcionamento do sistema de advertências\n\nEsse sistema registra advertências a longo prazo criado pelos moderadores do servidor, ao criar várias advertências para um usuário, se esse usuário atingir o limite de advertências, uma penalidade será aplicada!\n\nVocê pode definir qual será a penalidade, a quantidade de advertências requeridas e o tempo de mute (caso decida por mutar um usuário) pelos botões abaixo.\n\n🧻 Penalidades por advertências:\nEssa função aplicará uma penalidade ao usuário toda vez que receber uma advertência!\n\n🧻 Advertência cronometrada:\nAo ativar esse recurso, as advertências serão removidas após um tempo definido de forma automática, você pode usar esse recurso de modo a não precisar verificar o usuário toda vez, removendo suas advertências manualmente.```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.warn)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${emoji_button(guild?.warn.progressive)} **Progressiva**\n${emoji_button(guild?.warn.timed)} **Cronometrada**\n${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.repetencias")}: \`${guild.warn.cases}\`**`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **Penalidades**`,
                value: `${client.emoji("dancando_mod")} **Por advertência:** \n\`${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}\`\n:hammer: **Advertência final:** \n\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji(20)} ${emoji_button(guild?.warn.notify)} **Notificações**\n${client.emoji("icon_id")} \`${guild.warn.channel}\`\n( <#${guild.warn.channel}> )`,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("time")} **Tempos**`,
                value: `${client.defaultEmoji("time")} **Mute:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.timeout]}`)}\`\n:wastebasket: **Cronometrado:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\``,
                inline: false
            },
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
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    if (pagina === 0)
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "menu.botoes.advertencias"), type: type_button(guild?.conf.warn), emoji: emoji_button(guild?.conf.warn), data: "1" },
            { id: "guild_warns_button", name: "Progressiva", type: type_button(guild?.warn.progressive), emoji: emoji_button(guild?.warn.progressive), data: "7" },
            { id: "guild_warns_button", name: "Cronometrada", type: type_button(guild?.warn.timed), emoji: emoji_button(guild?.warn.timed), data: "6" },
            { id: "guild_warns_button", name: "Ajustes", type: 1, emoji: client.emoji(41), data: "9" }
        ])
    else
        botoes = botoes.concat([
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.warn.repetencias"), type: 1, emoji: client.emoji(47), data: "4" },
            { id: "guild_warns_button", name: "Penalidades", type: 1, emoji: client.defaultEmoji("warn"), data: "3" },
            { id: "guild_warns_button", name: "Notificações", type: type_button(guild?.warn.notify), emoji: emoji_button(guild?.warn.notify), data: "8" },
            { id: "guild_warns_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "5" }
        ])

    const obj = {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    }

    client.reply(interaction, obj)
}