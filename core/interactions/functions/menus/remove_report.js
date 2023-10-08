const { EmbedBuilder } = require("discord.js")

const { getReport } = require("../../../database/schemas/Report")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[0]
    const id_guild = dados.split(".")[1]

    const alvo = await getReport(id_alvo, id_guild)

    const embed = new EmbedBuilder()
        .setTitle("> Remover reporte")
        .setColor(0xED4245)
        .setDescription(`\`\`\`📃 | Descrição fornecida:\n\n${alvo.relatory}\`\`\`\nRevogar o reporte deste usuário limpará o seu histórico neste servidor, você pode confirmar essa operação ou cancelar pelos botões abaixo.`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                inline: true
            },
            {
                name: `**${client.defaultEmoji("guard")} ${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Server**",
                value: `${client.emoji("icon_id")} \`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"),
            iconURL: client.avatar()
        })

    // Criando os botões para as funções de reporte
    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "remove_report" },
        { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${id_guild}` },
        { id: "report_remove_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: "0" }
    ], interaction)

    if (!interaction.customId)
        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    else
        return interaction.update({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
}