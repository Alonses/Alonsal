const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, alvo }) => {

    alvo.archived = false
    alvo.relatory = interaction.options.getString("reason")
    alvo.timestamp = client.timestamp()

    // Enviando o embed para validação
    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "mode.report.reportado")} 🛂`)
        .addFields(
            {
                name: ":bust_in_silhouette: **Discord ID**",
                value: `\`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                inline: true
            },
            {
                name: `**${client.defaultEmoji("guard")} ${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `\`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Server ID**",
                value: `\`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                inline: true
            }
        )
        .setColor(0xED4245)
        .setDescription(`\`\`\`💢 | ${alvo.relatory}\`\`\`\n${client.tls.phrase(user, "mode.report.descricao_report")}`)
        .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: client.discord.user.avatarURL({ dynamic: true }) })

    // Salvando o alvo para editar posteriormente
    await alvo.save()

    // Criando os botões para as funções de reporte
    const row = client.create_buttons([{ id: "report_user", name: client.tls.phrase(user, "menu.botoes.confirmar_anunciando"), value: '1', type: 2, emoji: '📣', data: `1|${alvo.uid}` }, { id: "report_user", name: client.tls.phrase(user, "menu.botoes.apenas_confirmar"), value: '0', type: 1, emoji: '📫', data: `2|${alvo.uid}` }, { id: "report_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, emoji: client.emoji(0), data: `0|${alvo.uid}` }], interaction)

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
}