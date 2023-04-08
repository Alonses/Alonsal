const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getReportChannels } = require("../database/schemas/Guild")

module.exports = async ({ client, alvo, dados_alvo }) => {

    const canais_reporte = await getReportChannels()

    if (canais_reporte.length < 1)
        return client.notify(process.env.channel_feeds, ":man_guard: | Reporte de usuários cancelado, não há canais clientes registrados para receberem a atualização.")

    // Avatar do usuário
    let avatar_user = `https://cdn.discordapp.com/avatars/${alvo.uid}/${dados_alvo.user.avatar}.gif?size=1024`

    if (avatar_user !== null) {
        avatar_user = avatar_user.replace(".webp", ".gif")

        await fetch(avatar_user)
            .then(res => {
                if (res.status !== 200)
                    avatar_user = avatar_user.replace('.gif', '.webp')
            })
    } else
        avatar_user = ""

    try {
        canais_reporte.forEach(dados => {
            const canal_alvo = client.discord.channels.cache.get(dados.reports.channel)

            let idioma_definido = dados.lang || "pt-br"
            if (idioma_definido === "al-br") idioma_definido = "pt-br"

            const { data } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
            const mode = data.mode

            const embed = new EmbedBuilder()
                .setTitle("> Novo reporte :man_guard:")
                .setColor(0x29BB8E)
                .setThumbnail(avatar_user)
                .addFields(
                    {
                        name: ":globe_with_meridians: **Discord**",
                        value: `\`${dados_alvo.user.username.replace(/ /g, "")}#${dados_alvo.user.discriminator}\``,
                        inline: true
                    },
                    {
                        name: ":label: **Discord ID**",
                        value: `\`${dados_alvo.id}\``,
                        inline: true
                    },
                    { name: "⠀", value: "⠀", inline: true }
                )
                .setDescription(`\`\`\`💢 |  ${alvo.relatory}\`\`\``)

            if (canal_alvo) // Enviando os anúncios para os canais
                if (canal_alvo.type === 0 || canal_alvo.type === 5) {
                    if (canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.SendMessages) && canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.ViewChannel)) {
                        canal_alvo.send({ embeds: [embed] }) // Permissão para enviar mensagens no canal
                    }
                }
        })
    } catch (err) {
        require('../eventos/error.js')({ client, err })
    }
}