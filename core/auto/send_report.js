const { PermissionsBitField, ChannelType } = require('discord.js')

const { getReportChannels, getReportNetworkChannels } = require("../database/schemas/Guild")

module.exports = async ({ client, alvo, id_canal, link }) => {

    let canais_reporte = await getReportChannels()
    let network_descricao = ""

    if (link) // Listando os canais com base no link do network
        canais_reporte = await getReportNetworkChannels(link)

    if (canais_reporte.length < 1)
        return client.notify(process.env.channel_feeds, { content: ":man_guard: | Reporte de usuários não completado, não há canais clientes registrados para receberem a notificação." })

    // Coletando os dados em cache do servidor do reporte
    const cached_guild = await client.guilds(client.decifer(alvo.sid))

    canais_reporte.forEach(async guild => {
        const canal_alvo = client.discord.channels.cache.get(guild.reports.channel)

        if (!guild.lang)
            guild.lang = "pt-br"

        if (canal_alvo) // Enviando os anúncios para os canais
            if (canal_alvo.type === ChannelType.GuildText || canal_alvo.type === ChannelType.GuildAnnouncement) // Permissão para enviar mensagens no canal
                if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal_alvo)) {

                    let escopo_anuncio = `( ${client.defaultEmoji("earth")} ${client.tls.phrase(guild, "mode.report.aviso_global")} )`

                    if (link) { // Verificando se o escopo do reporte é apenas no network
                        escopo_anuncio = `( 📡 ${client.tls.phrase(guild, "mode.report.apenas_network")} )`
                        network_descricao = client.tls.phrase(guild, "mode.report.descricao_network")
                    }

                    const embed = client.create_embed({
                        title: `> ${client.tls.phrase(guild, "mode.report.novo_reporte")} ${client.defaultEmoji("guard")} ${escopo_anuncio}`,
                        color: "salmao",
                        description: `${network_descricao}\n\n\`\`\`${client.tls.phrase(guild, "mode.warn.descricao_fornecida", 4)}\n\n${client.decifer(alvo.relatory)}\`\`\``,
                        fields: [
                            {
                                name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                                value: `${client.emoji("icon_id")} \`${client.decifer(alvo.uid)}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(alvo.nick)}\`\n( <@${client.decifer(alvo.uid)}> )`,
                                inline: true
                            }
                        ]
                    })

                    // Enviando para todos os servidores ( invocado com o /report create )
                    if (!id_canal) {
                        embed.addFields(
                            {
                                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.report.reportador")}**`,
                                value: `${client.emoji("icon_id")} \`${client.decifer(alvo.issuer)}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(alvo.issuer_nick)}\`\n( <@${client.decifer(alvo.issuer)}> )`,
                                inline: true
                            },
                            {
                                name: ":globe_with_meridians: **Server**",
                                value: `${client.emoji("icon_id")} \`${client.decifer(alvo.sid)}\`\n( \`${cached_guild.name}\` )\n<t:${alvo.timestamp}:R>`,
                                inline: true
                            }
                        )

                        canal_alvo.send({ embeds: [embed] })

                    } else if (id_canal === guild.reports.channel) {

                        // Enviando apenas para o servidor com notificações de entrada ativas
                        embed.setTitle(`${client.tls.phrase(guild, "mode.report.reporte_registrado")} ${client.defaultEmoji("guard")}`)
                            .setDescription(`${client.tls.phrase(guild, "mode.report.historico")}\n\`\`\`${client.tls.phrase(guild, "mode.warn.descricao_fornecida", 4)}\n\n${client.decifer(alvo.relatory)}\`\`\``)
                            .setFooter({
                                text: client.tls.phrase(guild, "mode.report.rodape_historico"),
                                iconURL: client.avatar()
                            })

                        canal_alvo.send({ content: guild.reports.role ? `<@&${guild.reports.role}>` : "⠀", embeds: [embed] })
                    }
                }
    })
}