const { EmbedBuilder } = require("discord.js")

const { getUserWarns } = require("../../database/schemas/Warns")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const pagina = dados.split(".")[2]

    const guild = await client.getGuild(interaction.guild.id)
    const user_warns = await getUserWarns(id_alvo, interaction.guild.id)
    const member_guild = await client.getMemberGuild(interaction, user_warns)

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.warn.verificando_advertencia")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.tls.phrase(user, "mode.warn.advertencias_registradas")}\n\`\`\`fix\n📠 | ${client.tls.phrase(user, "mode.warn.ultima_descricao")}\n\n${user_warns.relatory}\`\`\``)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(user, "mode.logger.entrada_original")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp || 0 / 1000)}:F> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .addFields(
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.warn.aplicador_ultima_advertencia")}**`,
                value: `${client.emoji("icon_id")} \`${user_warns.assigner}\`\n( <@${user_warns.assigner}> )`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias_registro")}**`,
                value: `\`${user_warns.total} / ${guild.warn.cases}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "mode.warn.penalidade_server")}**`,
                value: `\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`${guild.warn.action === "member_mute" ? `\n${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.spam.tempo")}: \`${spamTimeoutMap[guild.warn.timeout][1]}\`**` : ""}`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: client.avatar()
        })

    // Criando os botões para as funções de advertência
    let botoes = [
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `warn_browse_user|${pagina}` },
        { id: "warn_remove_user", name: client.tls.phrase(user, "menu.botoes.remover_warns"), type: 1, emoji: client.emoji(39), data: `2|${id_alvo}.${interaction.guild.id}` }
    ]

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}