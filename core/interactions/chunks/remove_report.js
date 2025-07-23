const { EmbedBuilder } = require("discord.js")

const { getReport } = require("../../database/schemas/User_reports")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const id_guild = dados.split(".")[1]
    const pagina = dados.split(".")[2]

    const alvo = await getReport(client.encrypt(id_alvo), client.encrypt(id_guild))

    // Atribuindo um nome ao moderador que criou o reporte no servidor
    if (!alvo.issuer_nick) {
        const cached_issuer = await client.getCachedUser(client.decifer(alvo.issuer))

        alvo.issuer_nick = client.encrypt(cached_issuer.username)
        await alvo.save()
    }

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "mode.report.remover_reporte"))
        .setColor(0xED4245)
        .setDescription(client.tls.phrase(user, "mode.report.remover_reporte_desc", null, client.decifer(alvo.relatory)))
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${alvo.nick ? (client.decifer(alvo.nick).length > 20 ? `${client.decifer(alvo.nick).slice(0, 20)}...` : client.decifer(alvo.nick)) : client.tls.phrase(user, "mode.report.apelido_desconhecido")}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${client.decifer(alvo.issuer)}\`\n\`${alvo.issuer_nick ? (client.decifer(alvo.issuer_nick).length > 20 ? `${client.decifer(alvo.issuer_nick).slice(0, 20)}...` : client.decifer(alvo.issuer_nick)) : client.tls.phrase(user, "mode.report.apelido_desconhecido")}\`\n( <@${client.decifer(alvo.issuer)}> )`,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Server**",
                value: `${client.emoji("icon_id")} \`${client.decifer(alvo.sid)}\`\n<t:${alvo.timestamp}:R>`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: client.avatar()
        })

    // Criando os botões para as funções de reporte
    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `remove_report|${pagina}` },
        { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${id_guild}` },
        { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${id_guild}` }
    ], interaction)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}