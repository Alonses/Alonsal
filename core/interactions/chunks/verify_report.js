const { EmbedBuilder } = require("discord.js")

const { getUserReports } = require("../../database/schemas/Report")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const pagina = dados.split(".")[2]
    let avisos = 0, descricao = "", report_servidor = "", historico = []

    const alvo = {
        uid: id_alvo,
        nick: null,
        executer: null
    }

    const reports = await getUserReports(id_alvo)

    reports.forEach(valor => {
        avisos++

        if (valor.nick)
            alvo.nick = valor.nick

        historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)

        if (valor.sid === interaction.guild.id) {
            report_servidor = `\n:globe_with_meridians: **Reporte neste servidor:**\n\`\`\`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}\`\`\``
            alvo.executer = valor.issuer
        }
    })

    if (avisos > 0)
        descricao = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n---------\n").slice(0, 1000)}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "mode.report.historico_usuario"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${descricao}${report_servidor}`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                inline: true
            },
            {
                name: `:label: **${client.tls.phrase(user, "util.steam.nome")}**`,
                value: `\`${alvo.nick ? (alvo.nick.length > 20 ? `${alvo.nick.slice(0, 20)}...` : alvo.nick) : client.tls.phrase(user, "mode.report.apelido_desconhecido")}\``,
                inline: true
            },
            {
                name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos}**`,
                value: alvo.executer ? `**${client.defaultEmoji("guard")} ${client.tls.phrase(user, "mode.report.reportador")}**\n${client.emoji("icon_id")} \`${alvo.executer}\`\n( <@${alvo.executer}> )` : "⠀",
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: client.avatar()
        })

    // Criando os botões para as funções de reporte
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `report_browse_user|${pagina}` }]

    if (alvo.executer) // Botão para remover o reporte do usuário no servidor
        botoes = botoes.concat([{ id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.remover_reporte"), type: 1, emoji: client.emoji(10), data: `1|${id_alvo}.${interaction.guild.id}` }])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}