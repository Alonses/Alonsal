const { verifyUserReports } = require('../../../database/schemas/User_reports')
const { registerUserGuild } = require('../../../database/schemas/User_guilds')

module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados.guild.id)
    const user = await client.execute("getUser", { id_user: dados.user.id })

    if (user.conf?.cached_guilds) // Salvando o novo servidor ao usuário
        await registerUserGuild(user.uid, dados.guild.id)

    if (client.cached.join_guilds.has(dados.guild.id)) { // Servidores com cargos na entrada

        const acionador = "join", interaction = dados, id_user = dados.user.id
        require('../../../auto/triggers/user_assign_role')({ client, guild, interaction, id_user, acionador })
    }

    if (guild?.reports.notify) { // Notificando o servidor sobre a entrada de um usuário que possui reportes
        let historico = []

        const reports = await verifyUserReports(client.encrypt(dados.user.id))
        reports.forEach(valor => {
            historico.push(`${client.defaultEmoji("time")} ${new Date(valor.timestamp * 1000).toLocaleString("pt-BR")} | ${valor.issuer_nick || client.tls.phrase(guild, "util.steam.undefined")}: ${valor.relatory}`)
        })

        const alvo = {
            uid: dados.user.id,
            relatory: historico.join("\n\n")
        }

        if (alvo.relatory.length > 5) {
            const id_canal = guild.reports.channel
            require('../../../auto/send_report')({ client, alvo, id_canal })
        }
    }

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_join || !guild.conf.logger) return

    const embed = client.create_embed({
        title: { tls: "mode.logger.novo_membro" },
        color: "turquesa",
        fields: [
            {
                name: client.execute("user_title", { user: dados.user, scope: guild, tls: "util.server.membro" }),
                value: `${client.emoji("icon_id")} \`${dados.user.id}\`\n${client.emoji("mc_name_tag")} \`${dados.user.username}\`\n( <@${dados.user.id}> )`,
                inline: true
            }
        ],
        timestamp: true
    }, guild)

    const url_avatar = dados.user.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    client.execute("notify", {
        id_canal: guild.logger.channel,
        conteudo: { embeds: [embed] }
    })
}