const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, guild, dados }) => {

    const user_alvo = dados[0].user
    let texto = "", removidos = [], adicionados = [], permissoes_fn = ""
    let old_member = dados[0], new_member = dados[1]

    if (old_member.roles.cache.size > new_member.roles.cache.size)
        old_member.roles.cache.forEach(role => {
            if (!new_member.roles.cache.has(role.id))
                removidos.push(`<@&${role.id}>`)
        })
    else
        new_member.roles.cache.forEach(role => {
            if (!old_member.roles.cache.has(role.id))
                adicionados.push(`<@&${role.id}>`)
        })

    if (adicionados.length > 0)
        texto += `\n**:sparkle: ${client.tls.phrase(guild, "mode.logger.cargo_adicionado")}:** ${adicionados.join(", ")}`

    if (removidos.length > 0)
        texto += `\n**:no_entry_sign: ${client.tls.phrase(guild, "mode.logger.cargo_removido")}:** ${removidos.join(", ")}`

    // Membros não salvos no cache
    if (texto.length < 1) return

    const permissoes_user = new_member.permissions.toArray()

    // Listando todas as permissões do usuário
    for (let i = 0; i < permissoes_user.length; i++) {
        if (typeof permissoes_user[i + 1] === "undefined")
            permissoes_fn += " & "

        permissoes_fn += `\`${permissoes_user[i]}\``

        if (typeof permissoes_user[i + 2] !== "undefined")
            permissoes_fn += ", "
    }

    permissoes_fn = permissoes_fn.slice(0, 2000)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.cargo_atualizado"))
        .setColor(0x29BB8E)
        .setDescription(texto)
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "util.user.entrada")}**`,
                value: `<t:${parseInt(new_member.joinedTimestamp / 1000)}:F> ( <t:${Math.floor(new_member.joinedTimestamp / 1000)}:R> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: user_alvo.username
        })

    // User é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    embed.addFields(
        {
            name: `**:shield: ${client.tls.phrase(guild, "mode.logger.permissoes_apos")}**`,
            value: `${permissoes_fn}`,
            inline: false
        }
    )

    const url_avatar = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    if (url_avatar)
        embed.setThumbnail(url_avatar)

    client.notify(guild.logger.channel, embed)
}