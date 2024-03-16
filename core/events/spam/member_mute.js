const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = async ({ client, message, guild, strike_aplicado, user_messages, user, user_guild, guild_bot, tempo_timeout }) => {

    let entradas_spamadas = ""

    // Verificando se a hierarquia do bot é maior que a do membro e se o bot pode mutar membros
    if (!await client.permissions(message, client.id(), [PermissionsBitField.Flags.ModerateMembers]) || guild_bot.roles.highest.position < user_guild.roles.highest.position)
        return client.notify(guild.spam.channel || guild.logger.channel, { content: client.tls.phrase(guild, "mode.spam.falta_permissoes_2", client.defaultEmoji("guard"), user_guild), embeds: [embed] })

    // Listando as mensagens consideras spam e excluindo elas
    user_messages.forEach(internal_message => {
        entradas_spamadas += `-> ${internal_message.content}\n[ ${new Date(internal_message.createdTimestamp).toLocaleTimeString()} ]\n\n`
    })

    // Criando o embed de aviso para os moderadores
    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.spam.titulo"))
        .setColor(0xED4245)
        .setDescription(`${client.tls.phrase(guild, "mode.spam.spam_aplicado", client.defaultEmoji("guard"), [user_guild.user.username, client.locale(tempo_timeout / 60)])}\n\`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``)
        .addFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n\`${user_guild.user.username}\`\n( ${user_guild} )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.spam.vigencia")}**`,
                value: `<t:${client.timestamp() + tempo_timeout}:f>\n( <t:${client.timestamp() + tempo_timeout}:R> )`,
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

    // Mutando o usuário causador do spam
    user_guild.timeout(tempo_timeout * 1000, client.tls.phrase(guild, "mode.spam.justificativa_mute"))
        .then(async () => {

            const obj = {
                content: client.tls.phrase(guild, "mode.spam.ping_spam", null, `<@${user_guild.id}>`),
                embeds: [embed]
            }

            if (guild.spam.notify) // Servidor com ping de spam ativado
                obj.content = `@here ${obj.content}`

            client.notify(guild.spam.channel || guild.logger.channel, obj)

            const embed_user = new EmbedBuilder()
                .setTitle(client.tls.phrase(guild, "mode.spam.spam_titulo_user"))
                .setColor(0xED4245)

            let msg_user = `${client.tls.phrase(user, "mode.spam.silenciado", null, await client.guilds().get(guild.sid).name)} \`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``
            let text = `${user_messages[0].content} `

            if (text.match(client.cached.regex))
                msg_user += `\n${client.defaultEmoji("detective")} | ${client.tls.phrase(user, "mode.spam.aviso_links")}`

            embed_user.setDescription(msg_user)
            client.sendDM(user, { embeds: embed_user }, true)
        })
        .catch(console.error)
}