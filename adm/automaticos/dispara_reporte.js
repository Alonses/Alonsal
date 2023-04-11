const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getReportChannels } = require("../database/schemas/Guild")

module.exports = async ({ client, alvo }) => {

    const canais_reporte = await getReportChannels()

    if (canais_reporte.length < 1)
        return client.notify(process.env.channel_feeds, ":man_guard: | Reporte de usuários cancelado, não há canais clientes registrados para receberem a atualização.")

    try {
        canais_reporte.forEach(dados => {
            const canal_alvo = client.discord.channels.cache.get(dados.reports.channel)

            let idioma_definido = dados.lang || "pt-br"
            if (idioma_definido === "al-br") idioma_definido = "pt-br"

            const embed = new EmbedBuilder()
                .setTitle(`> Novo reporte ${client.defaultEmoji("guard")}`)
                .setColor(0xED4245)
                .addFields(
                    {
                        name: ":bust_in_silhouette: **Discord ID**",
                        value: `\`${alvo.uid}\`\n( <@${alvo.uid}> )`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("guard")} **Reportador**`,
                        value: `\`${alvo.issuer}\`\n( <@${alvo.issuer}> )`,
                        inline: true
                    },
                    {
                        name: ":globe_with_meridians: **Server ID**",
                        value: `\`${alvo.sid}\`\n<t:${alvo.timestamp}:R>`,
                        inline: true
                    }
                )
                .setDescription(`\n\n\`\`\`💢 | ${alvo.relatory}\`\`\``)

            if (canal_alvo) // Enviando os anúncios para os canais
                if (canal_alvo.type === 0 || canal_alvo.type === 5)
                    if (canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.SendMessages) && canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.ViewChannel))
                        canal_alvo.send({ embeds: [embed] }) // Permissão para enviar mensagens no canal
        })
    } catch (err) {
        require('../eventos/error.js')({ client, err })
    }
}