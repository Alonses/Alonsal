const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, user_alvo, registroAudita2 }) => {

    if (guild.network.member_kick && guild.conf.network) // Network de servidores
        client.network(guild, "kick", user_alvo.id)

    if (guild.conf.nuke_invites) // Buscando pelos convites do usuário removido
        client.checkUserInvites(guild, user_alvo.id)

    // Verificando se o recurso está ativo
    if (!guild.logger.member_kick || !guild.conf.logger) return

    let razao = "", network_descricao = "", canal_aviso = guild.logger.channel

    // Alterando o canal alvo conforme o filtro de eventos do death note
    if (guild.death_note.note && guild.death_note.member_kick && guild.death_note.channel)
        canal_aviso = guild.death_note.channel

    if (registroAudita2.reason) { // Banimento com motivo explicado
        razao = `💂‍♂️ ${client.tls.phrase(guild, "mode.logger.motivo_expulsao")}: ${registroAudita2.reason}`

        // Ação realizada através do network
        if (registroAudita2.reason.includes("Network | ") && registroAudita2.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita2.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.membro_expulso"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.logger.membro_expulso_desc", client.emoji("mc_writable_book"))}${razao}`)
        .setFields(
            {
                name: client.user_title(user_alvo, guild),
                value: `${client.emoji("icon_id")} \`${registroAudita2.targetId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.target.username}\`\n( <@${registroAudita2.targetId}> )`,
                inline: true
            },
            {
                name: client.user_title(registroAudita2.executor, guild),
                value: `${client.emoji("icon_id")} \`${registroAudita2.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita2.executor.username}\`\n( <@${registroAudita2.executorId}> )`,
                inline: true
            }
        )
        .setTimestamp()

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })
    if (url_avatar) embed.setThumbnail(url_avatar)

    const obj = {
        embeds: [embed]
    }

    // Notificações do Death note
    if (guild.death_note.channel === canal_aviso && guild.death_note.notify)
        obj.content = "@here"

    client.notify(canal_aviso, obj)
}