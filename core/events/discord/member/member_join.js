const { EmbedBuilder } = require('discord.js')

const { getUserReports } = require('../../../database/schemas/User_reports')
const { registerUserGuild } = require('../../../database/schemas/User_guilds')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)
    const user = await client.getUser(dados.user.id)

    if (user.conf?.cached_guilds) // Salvando o novo servidor ao usuário
        await registerUserGuild(user.uid, dados.guild.id)

    if (guild?.reports.notify) { // Notificando o servidor sobre a entrada de um usuário que possui reportes
        let avisos = 0, historico = []

        const reports = await getUserReports(dados.user.id)
        reports.forEach(valor => {
            avisos++

            historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")} | ${valor.relatory}`)
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
        .setFields(
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, { embeds: [embed] })
}