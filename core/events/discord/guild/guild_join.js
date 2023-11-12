const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')

const { verifyDynamicBadge } = require('../../../database/schemas/Badge')
const { badges } = require('../../../data/badges')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size
    let server_info = `\n\n:busts_in_silhouette: **Members** ( \`${guild.memberCount - 1}\` )\n:placard: **Channels** ( \`${canais}\` )`

    // Permissão para ver o registro de auditoria, não registra o usuário que adicionou o bot
    const permissoes = await client.permissions(guild, client.id(), PermissionsBitField.Flags.ViewAuditLog)
    if (permissoes) {

        // Resgatando informações sobre o usuário que adicionou o bot ao servidor
        guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 }).then(async log => {

            const user = log.entries.first().executor
            const internal_guild = await client.getGuild(guild.id)

            // Salvando o ID do usuário que adicionou o bot ao servidor
            if (user) {
                internal_guild.inviter = user.id
                await internal_guild.save()
            }

            verifyDynamicBadge(client, "hoster", badges.HOSTER) // Verificando qual usuário mais convidou o bot
        })
    }

    const embed = new EmbedBuilder()
        .setTitle("> 🟢 Server update")
        .setColor(0x29BB8E)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )${server_info}`)
        .setTimestamp()

    client.notify(process.env.channel_server, { embeds: [embed] })
}