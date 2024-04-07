const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { verifyDynamicBadge } = require('../../../database/schemas/Badge')
const { badges } = require('../../../data/badges')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    const internal_guild = await client.getGuild(guild.id)
    internal_guild.erase.valid = false
    await internal_guild.save()

    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size
    let server_info = `\n\n:busts_in_silhouette: **Members** ( \`${guild.memberCount - 1}\` )\n:placard: **Channels** ( \`${canais}\` )`

    // Verificando permissão para do registro de auditoria, não registra o usuário que adicionou o bot
    if (await client.permissions(guild, client.id(), PermissionsBitField.Flags.ViewAuditLog)) {

        // Resgatando informações sobre o usuário que adicionou o bot ao servidor
        guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 }).then(async log => {

            const user = log.entries.first().executor

            // Salvando o ID do usuário que adicionou o bot ao servidor
            if (user) {

                // Apenas contabiliza o hoster caso o servidor possua muitos membros
                if ((guild.memberCount - 1) > 20) {
                    internal_guild.inviter = user.id
                    await internal_guild.save()
                }

                const inviter = await client.getUser(user.id)

                // Enviando um Embed ao usuário que adicionou o bot ao servidor
                const row = client.create_buttons([
                    { name: client.tls.phrase(inviter, "inic.ping.site"), type: 4, emoji: "🌐", value: 'http://alonsal.discloud.app/' },
                    { name: client.tls.phrase(inviter, "inic.inicio.suporte"), type: 4, emoji: client.emoji("icon_rules_channel"), value: process.env.url_support }
                ])

                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(inviter, "inic.ping.titulo"))
                    .setColor(client.embed_color(inviter.misc.color))
                    .setImage("https://i.imgur.com/N8AFVTH.png")
                    .setDescription(`${client.tls.phrase(inviter, "inic.ping.boas_vindas")}\n\n${client.defaultEmoji("earth")} | ${client.tls.phrase(inviter, "inic.ping.idioma_dica_server")}`)

                client.sendDM(inviter, { embeds: [embed], components: [row] }, true)
            }

            // Checking which user invited the bot the most
            if ((guild.memberCount - 1) > 20) verifyDynamicBadge(client, "hoster", badges.HOSTER)
        })
    }

    const embed = new EmbedBuilder()
        .setTitle("> 🟢 Server update")
        .setColor(0x29BB8E)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.notify(process.env.channel_server, { embeds: [embed] })
}