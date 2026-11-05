const { getReport } = require("../../database/schemas/User_reports")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const id_guild = dados.split(".")[1]
    const pagina = dados.split(".")[2]

    const alvo = await getReport(client.encrypt(id_alvo), client.encrypt(id_guild))

    // Atribuindo um nome ao moderador que criou o reporte no servidor
    if (!alvo.issuer_nick) {
        const cached_issuer = await client.getCachedUser(alvo.issuer)

        alvo.issuer_nick = cached_issuer.username
        await alvo.save()
    }

    const embed = client.create_embed({
        title: { tls: "mode.report.remover_reporte" },
        color: "salmao",
        description: { tls: "mode.report.remover_reporte_desc", replace: alvo.relatory },
        fields: [
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${alvo.nick ? (alvo.nick.length > 20 ? `${alvo.nick.slice(0, 20)}...` : alvo.nick) : client.tls.phrase(user, "mode.report.apelido_desconhecido")}\`\n( <@${id_alvo}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.issuer}\`\n\`${alvo.issuer_nick ? (alvo.issuer_nick.length > 20 ? `${alvo.issuer_nick.slice(0, 20)}...` : alvo.issuer_nick) : client.tls.phrase(user, "mode.report.apelido_desconhecido")}\`\n( <@${alvo.issuer}> )`,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Server**",
                value: `${client.emoji("icon_id")} \`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                inline: true
            }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: client.avatar()
        }
    }, user)

    // Criando os botões para as funções de reporte
    const row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `remove_report|${pagina}` },
        { id: "report_remove_user", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `1|${id_alvo}.${id_guild}` },
        { id: "report_remove_user", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${id_guild}` }
    ], interaction, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}