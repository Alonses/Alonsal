const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getReportChannels } = require("../database/schemas/Guild")

module.exports = async ({ client, alvo, id_canal }) => {

    const canais_reporte = await getReportChannels()

    if (canais_reporte.length < 1)
        return client.notify(process.env.channel_feeds, { content: ":man_guard: | Reporte de usuários cancelado, não há canais clientes registrados para receberem a atualização." })

    // Coletando os dados em cache do servidor do reporte
    const cached_guild = await client.guilds(alvo.sid)

    canais_reporte.forEach(guild => {
        const canal_alvo = client.discord.channels.cache.get(guild.reports.channel)

        if (!guild.lang)
            guild.lang = "pt-br"

        if (canal_alvo) // Enviando os anúncios para os canais
            if (canal_alvo.type === 0 || canal_alvo.type === 5) // Permissão para enviar mensagens no canal
                if (canal_alvo.permissionsFor(client.id()).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) {

                    const embed = new EmbedBuilder()
                        .setTitle(`> ${client.tls.phrase(guild, "mode.report.novo_reporte")} ${client.defaultEmoji("guard")}`)
                        .setColor(0xED4245)
                        .setDescription(`\n\n\`\`\`${client.tls.phrase(guild, "mode.warn.descricao_fornecida", 4)}\n\n${alvo.relatory}\`\`\``)
                        .addFields(
                            {
                                name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                                value: `${client.emoji("icon_id")} \`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                                inline: true
                            }
                        )

                    // Enviando para todos os servidores ( invocado com o /report create )
                    if (typeof id_canal === "undefined") {
                        embed.addFields(
                            {
                                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.report.reportador")}**`,
                                value: `${client.emoji("icon_id")} \`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                                inline: true
                            },
                            {
                                name: ":globe_with_meridians: **Server**",
                                value: `${client.emoji("icon_id")} \`${alvo.sid}\`\n( \`${cached_guild.name}\` )\n<t:${alvo.timestamp}:R>`,
                                inline: true
                            }
                        )

                        canal_alvo.send({ embeds: [embed] })

                    } else if (id_canal === guild.reports.channel) {

                        // Enviando apenas para o servidor com notificações de entrada ativas
                        embed.setTitle(client.tls.phrase(guild, "mode.report.reporte_registrado"))
                            .setDescription(`${client.tls.phrase(guild, "mode.report.historico")}\n\`\`\`${client.tls.phrase(guild, "mode.warn.descricao_fornecida", 4)}\n\n${alvo.relatory}\`\`\``)

                        canal_alvo.send({ content: "@here", embeds: [embed] })
                    }
                }
    })
}