const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, registroAudita, dados }) => {

    const user_alvo = dados[0].user
    const timeout = registroAudita.changes[0].new ? parseInt(new Date(registroAudita.changes[0].new) - new Date()) : null
    const member_guild = await client.getMemberGuild(guild.sid, user_alvo.id)
    let razao = "", network_descricao = "", canal_aviso = guild.logger.channel

    if (registroAudita.reason) { // Castigo com motivo explicado
        razao = `\n💂‍♂️ Motivo do castigo: ${registroAudita.reason.includes("Network | ") ? registroAudita.reason.split("Network | ")[1] : registroAudita.reason}`

        // Ação realizada através do network
        if (registroAudita.reason.includes("Network") && registroAudita.executorId === client.id()) {
            network_descricao = `📡 ${registroAudita.reason.split(" | ")[1]}`
            razao = ""

            if (guild.network.channel) // Ação realizada pelo network
                canal_aviso = guild.network.channel
        }
    }

    if (network_descricao.length > 1 || razao.length > 1)
        razao = `\n\`\`\`fix\n${network_descricao}${razao}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(timeout ? "> Membro castigado 🔇" : "> Remoção de castigo 🔊")
        .setColor(timeout ? 0xED4245 : 0xffffff)
        .setDescription(`${timeout ? "**Um membro foi castigado**" : "**Um membro foi perdoado**"}${razao}`)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${registroAudita.executorId}\`\n${client.emoji("mc_name_tag")} \`${registroAudita.executor.username}\`\n( <@${registroAudita.executorId}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (timeout) // Exibindo o tempo de castigo que o membro recebeu
        embed.addFields(
            {
                name: `${client.defaultEmoji("time")} **Tempo de castigo**`,
                value: `<t:${parseInt(client.timestamp() + (timeout / 1000))}:F>\n( <t:${parseInt(client.timestamp() + (timeout / 1000))}:R> )`,
                inline: false
            }
        )
    else
        embed.addFields(
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
                value: `<t:${parseInt(member_guild.joinedTimestamp / 1000)}:F>\n( <t:${Math.floor(member_guild.joinedTimestamp / 1000)}:R> )`,
                inline: false
            }
        )

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

    client.notify(canal_aviso, { embeds: [embed] })
}