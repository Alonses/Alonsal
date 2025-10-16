const { listAllUserWarns } = require("../../database/schemas/User_warns")
const { listAllGuildWarns } = require("../../database/schemas/Guild_warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_user = dados.split(".")[0]
    const pagina = dados.split(".")[3]

    const user_warns = await listAllUserWarns(id_user, interaction.guild.id)
    const member_guild = await client.execute("getMemberGuild", { interaction, id_user })
    const guild_warns = await listAllGuildWarns(interaction.guild.id)

    let indice_matriz = client.execute("verifyMatrixIndex", { guild_config: guild_warns }) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

    // Verificando se existem advertências para as próximas punições do usuário
    let indice_warn = user_warns.length > guild_warns.length ? guild_warns.length - 1 : user_warns.length

    const embed = client.create_embed({
        title: `${client.tls.phrase(user, "mode.warn.verificando_advertencia")} :inbox_tray:`,
        description: `${client.tls.phrase(user, "mode.warn.advertencias_registradas")}\n\`\`\`fix\n${client.tls.phrase(user, "mode.warn.ultima_descricao", 51)}\n\n${user_warns[user_warns.length - 1].relatory}\`\`\``,
        fields: [
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_user}\`\n${client.emoji("mc_name_tag")} \`${user_warns[user_warns.length - 1].nick}\`\n( <@${id_user}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(user, "util.user.entrada")}**`,
                value: member_guild ? `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>` : `\`${client.tls.phrase(user, "mode.report.entrada_desconhecida")}\``,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias")}**`,
                value: `\`${indice_warn} / ${indice_matriz}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.warn.aplicador_ultima_advertencia")}**`,
                value: `${client.emoji("icon_id")} \`${user_warns[user_warns.length - 1].assigner}\`\n${client.emoji("mc_name_tag")} \`${user_warns[user_warns.length - 1].assigner_nick}\`\n( <@${user_warns[user_warns.length - 1].assigner}> )`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "mode.warn.proxima_penalidade")}**`,
                value: client.execute("verifyAction", { action: guild_warns[indice_warn - 1], source: user }),
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para as funções de advertência
    let botoes = [
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `warn_browse_user|${pagina}` },
        { id: "warn_remove_user", name: { tls: "menu.botoes.remover_advertencias" }, type: 0, emoji: client.emoji(42), data: `2|${id_user}.${interaction.guild.id}` },
        { id: "panel_guild_browse_warns", name: { tls: "menu.botoes.gerenciar_advertencias" }, type: 0, emoji: client.emoji(41), data: `0|${id_user}` }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction, user)],
        flags: "Ephemeral"
    })
}