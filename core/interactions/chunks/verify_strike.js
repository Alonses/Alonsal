const { EmbedBuilder } = require("discord.js")

const { listAllUserStrikes } = require("../../database/schemas/User_strikes")
const { listAllGuildStrikes } = require("../../database/schemas/Guild_strikes")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const pagina = dados.split(".")[3]

    const user_strikes = await listAllUserStrikes(id_alvo, interaction.guild.id)
    const member_guild = await client.getMemberGuild(interaction, id_alvo)
    const guild_strikes = await listAllGuildStrikes(interaction.guild.id)

    let indice_matriz = client.verifyGuildWarns(guild_strikes) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

    // Verificando se existem advertências para as próximas punições do usuário
    let indice_strike = user_strikes.length > guild_strikes.length ? guild_strikes.length - 1 : user_strikes.length

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.spam.verificando_strike")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.tls.phrase(user, "mode.spam.strikes_registrados")}\n\`\`\`fix\n${client.tls.phrase(user, "mode.warn.ultima_descricao", 51)}\n\n${user_strikes[user_strikes.length - 1].relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`@${user_strikes[user_strikes.length - 1].nick}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(user, "util.user.entrada")}**`,
                value: member_guild ? `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>` : `\`${client.tls.phrase(user, "mode.report.entrada_desconhecida")}\``,
                inline: true
            },
            {
                name: `${client.emoji(47)} **Strikes**`,
                value: `\`${indice_strike} / ${indice_matriz}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.warn.aplicador_ultima_advertencia")}**`,
                value: `${client.emoji("icon_id")} \`${user_strikes[user_strikes.length - 1].assigner}\`\n( <@${user_strikes[user_strikes.length - 1].assigner}> )`,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "mode.warn.proxima_penalidade")}**`,
                value: client.verifyWarnAction(guild_strikes[indice_strike - 1], user),
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: client.avatar()
        })

    // Criando os botões para as funções de strikes
    let botoes = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `strike_browse_user|${pagina}` },
        { id: "strike_remove_user", name: client.tls.phrase(user, "menu.botoes.remover_strikes"), type: 1, emoji: client.emoji(42), data: `2|${id_alvo}.${interaction.guild.id}` },
        { id: "panel_guild_browse_strikes", name: client.tls.phrase(user, "menu.botoes.gerenciar_strikes"), type: 1, emoji: client.emoji(41), data: `0|${id_alvo}` }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}