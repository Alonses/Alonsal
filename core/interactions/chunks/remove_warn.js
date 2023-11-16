const { EmbedBuilder } = require("discord.js")

const { getUserWarns } = require("../../database/schemas/Warns")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const id_guild = dados.split(".")[1]
    const pagina = dados.split(".")[2]

    const alvo = await getUserWarns(id_alvo, id_guild)
    const guild = await client.getGuild(interaction.guild.id)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "mode.warn.remover_advertencia"))
        .setColor(0xED4245)
        .setDescription(client.replace(client.tls.phrase(user, "mode.report.remover_reporte_desc"), alvo.relatory))
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.assigner}\`\n( <@${alvo.assigner}> )`,
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

    // Criando os botões para as funções de advertências
    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `remove_warn|${pagina}` },
        { id: "warn_remove_user", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${id_guild}` },
        { id: "warn_remove_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${id_guild}` }
    ], interaction)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}