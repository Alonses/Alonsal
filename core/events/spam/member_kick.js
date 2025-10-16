const { PermissionsBitField } = require("discord.js")

module.exports = async ({ client, message, guild, user_messages, strike_aplicado, indice_matriz, mensagens_spam, user, user_guild, guild_bot }) => {

    // Verificando se a hierarquia do bot é maior que a do membro e se o bot pode expulsar membros
    if (!await client.execute("permissions", { message, id_user: client.id(), permissions: [PermissionsBitField.Flags.KickMembers] }) || guild_bot.roles.highest.position <= user_guild.roles.highest.position)
        return client.execute("notify", {
            id_canal: guild.spam.channel || guild.logger.channel,
            conteudo: { content: client.tls.phrase(guild, "mode.spam.falta_permissoes_3", client.defaultEmoji("guard"), `<@${user_guild.id}>`) }
        })

    // Criando o embed de aviso para os moderadores
    let embed = client.create_embed({
        title: `${client.tls.phrase(guild, "mode.spam.titulo")} ( ${(strike_aplicado?.rank || 0) + 1} / ${indice_matriz} )`,
        color: "ciara",
        description: `${client.tls.phrase(guild, "mode.spam.strikes_desc", 46)}\n\`\`\`${mensagens_spam}\`\`\``,
        fields: [
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n${client.emoji("mc_name_tag")} \`${user_guild.user.username}\`\n( ${user_guild} )`,
                inline: true
            }
        ]
    })

    // Data de entrada do membro no servidor
    embed = client.execute("formata_entrada_membro", { client, guild, user_guild, embed })

    if (user_guild.user.avatarURL({ dynamic: true, size: 2048 }))
        embed.setThumbnail(user_guild.user.avatarURL({ dynamic: true, size: 2048 }))

    // Expulsando o membro capturado pelo spam
    user_guild.kick(client.tls.phrase(guild, "mode.spam.strikes_kick"))
        .then(async () => {

            const obj = {
                content: client.tls.phrase(guild, "mode.spam.ping_expulsao", null, `<@${user_guild.id}>`),
                embeds: [embed]
            }

            if (guild.spam.notify) // Servidor com ping de spam ativado
                obj.content = `@here ${obj.content}`

            client.execute("notify", {
                id_canal: guild.spam.channel || guild.logger.channel,
                conteudo: obj
            })

            const embed_user = client.create_embed({
                title: `${client.tls.phrase(user, "mode.spam.spam_titulo_user")} ( ${(strike_aplicado?.rank || 0) + 1} / ${indice_matriz} )`,
                color: "ciara"
            })

            let msg_user = `${client.tls.phrase(user, "mode.spam.justificativa_kick", null, await client.guilds().get(guild.sid).name)} \`\`\`${mensagens_spam}\`\`\``

            if (`${user_messages[0].content} `.match(client.cached.regex))
                msg_user += `\n${client.defaultEmoji("detective")} | ${client.tls.phrase(user, "mode.spam.aviso_links")}`

            embed_user.setDescription(msg_user)
            client.execute("sendDM", { user, dados: { embeds: [embed_user] }, force: true })
        })
        .catch(console.error)
}