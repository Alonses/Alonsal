const { EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../../database/schemas/Report')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)

    // Notificando o servidor sobre a entrada de um usuário com reportes
    if (guild?.reports.notify) {
        let avisos = 0, historico = []

        const reports = await getUserReports(dados.user.id)
        reports.forEach(valor => {
            avisos++

            historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
        })

        const alvo = {
            uid: dados.user.id,
            relatory: historico.join("\n\n")
        }

        if (avisos > 0) {
            const id_canal = guild.reports.channel
            require('../../../auto/send_report')({ client, alvo, id_canal })
        }
    }

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_join || !guild.conf.logger) return

    const user_alvo = dados.user

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.novo_membro"))
        .setColor(0x29BB8E)
        .setFields({
            name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
            value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
            inline: true
        })
        .setTimestamp()

    // Usuário é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}