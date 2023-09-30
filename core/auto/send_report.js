const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getReportChannels } = require("../database/schemas/Guild")

module.exports = async ({ client, alvo }) => {

    const canais_reporte = await getReportChannels()

    if (canais_reporte.length < 1)
        return client.notify(process.env.channel_feeds, ":man_guard: | Reporte de usuários cancelado, não há canais clientes registrados para receberem a atualização.")

    try {
        canais_reporte.forEach(guild => {
            const canal_alvo = client.discord.channels.cache.get(guild.reports.channel)

            if (!guild.lang)
                guild.lang = "pt-br"

            const embed = new EmbedBuilder()
                .setTitle(`> ${client.tls.phrase(guild, "mode.report.novo_reporte")} ${client.defaultEmoji("guard")}`)
                .setColor(0xED4245)
                .setDescription(`\n\n\`\`\`💢 | ${alvo.relatory}\`\`\``)
                .addFields(
                    {
                        name: `**:bust_in_silhouette: ${client.tls.phrase(guild, "mode.report.usuario")}**`,
                        value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                        inline: true
                    },
                    {
                        name: `**${client.defaultEmoji("guard")} ${client.tls.phrase(guild, "mode.report.reportador")}**`,
                        value: `${client.emoji("icon_id")} \`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                        inline: true
                    },
                    {
                        name: ":globe_with_meridians: **Server**",
                        value: `${client.emoji("icon_id")} \`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                        inline: true
                    }
                )

            if (canal_alvo) // Enviando os anúncios para os canais
                if (canal_alvo.type === 0 || canal_alvo.type === 5)
                    if (canal_alvo.permissionsFor(client.id()).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]))
                        canal_alvo.send({
                            embeds: [embed]
                        }) // Permissão para enviar mensagens no canal
        })
    } catch (err) {
        client.error(err, "Report")
    }
}