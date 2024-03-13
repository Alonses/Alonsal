const { EmbedBuilder } = require("discord.js")

module.exports = async ({ client, message, guild, strike_aplicado, user_messages, user, user_guild, guild_bot, tempo_timeout }) => {

    let entradas_spamadas = ""

    // Listando as mensagens consideras spam e excluindo elas
    user_messages.forEach(internal_message => {
        entradas_spamadas += `-> ${internal_message.content}\n[ ${new Date(internal_message.createdTimestamp).toLocaleTimeString()} ]\n\n`
    })

    // Criando o embed de aviso para os moderadores
    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.spam.titulo"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.spam.spam_detectado", client.defaultEmoji("guard"), user_guild.nickname)}\n\`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``)
        .addFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n( ${user_guild} )`,
                inline: true
            }
        )

    // Strike possui um cargo vinculado
    if (strike_aplicado.role)
        embed.addFields({
            name: client.tls.phrase(guild, "mode.spam.cargo_acrescentado"),
            value: `:label: <@&${strike_aplicado.role}>`,
            inline: true
        })

    if (user_guild.avatarURL({ dynamic: true, size: 2048 }))
        embed.setThumbnail(user_guild.avatarURL({ dynamic: true, size: 2048 }))

    // Notificando o membro capturado pelo spam
    const obj = {
        content: client.tls.phrase(guild, "mode.spam.ping_capturado", null, user_guild),
        embeds: [embed]
    }

    if (guild.spam.notify) // Servidor com ping de spam ativado
        obj.content = `@here ${obj.content}`

    client.notify(guild.logger.channel, obj)

    let msg_user = `${client.tls.phrase(user, "mode.spam.capturado", null, await client.guilds().get(guild.sid).name)} \`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``

    if (user_messages[0].content.includes("http") || user_messages[0].content.includes("www"))
        msg_user += `\n${client.defaultEmoji("detective")} | ${client.tls.phrase(user, "mode.spam.aviso_links")}`

    client.sendDM(user, { data: `${client.defaultEmoji("guard")} | ${msg_user}` }, true)
}