const { PermissionsBitField, AuditLogEvent } = require('discord.js')

const { getNetworkedGuilds } = require('../database/schemas/Guild')

const network_map = new Map()

const cases = {
    "ban_add": "member_ban_add",
    "ban_del": "member_ban_add",
    "kick": "member_kick",
    "mute": "member_punishment"
}

module.exports = async ({ client, guild, caso, id_alvo }) => {

    // Permissão para ver o registro de auditoria, desabilitando o recurso
    const bot = await client.getMemberPermissions(guild.sid, client.id())
    if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

        guild.conf.network = false
        await guild.save()

        return
    }

    const guilds_network = await getNetworkedGuilds(guild.network.link)
    const guild_evento = await client.guilds(guild.sid)
    let fetchedLogs

    if (caso === "ban_add") // Coletando dados sobre o evento
        fetchedLogs = await guild_evento.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
            limit: 1,
        })
    else if (caso === "ban_del")
        fetchedLogs = await guild_evento.fetchAuditLogs({
            type: AuditLogEvent.MemberBanRemove,
            limit: 1,
        })
    else if (caso === "mute")
        fetchedLogs = await guild_evento.fetchAuditLogs({
            type: AuditLogEvent.MemberUpdate,
            limit: 1,
        })
    else if (caso === "kick")
        fetchedLogs = await guild_evento.fetchAuditLogs({
            type: AuditLogEvent.MemberKick,
            limit: 1,
        })

    const registroAudita = fetchedLogs.entries.first()

    if (!registroAudita)
        return

    if (!network_map.has(registroAudita.targetId)) {
        network_map.set(registroAudita.targetId, true)

        for (let i = 0; i < guilds_network.length; i++) {

            let internal_guild = guilds_network[i]

            // Verificando se o servidor é diferente e o recurso respectivo está sincronizado
            if (internal_guild.sid !== guild.sid && internal_guild.network[cases[caso]]) {

                const guild_member = await client.getMemberPermissions(internal_guild.sid, registroAudita.targetId)
                const guild_executor = await client.getMemberPermissions(internal_guild.sid, registroAudita.executorId)
                const bot_member = await client.getMemberPermissions(internal_guild.sid, client.id())
                let cached_guild = await client.guilds(internal_guild.sid)

                if ((!guild_member || !guild_executor) && caso !== "ban_del")
                    return // Membro não está no servidor

                if (caso === "ban_del" && !guild_executor)
                    return // Moderador não está no servidor

                // Redirecionando o evento para o end-point respectivo
                require(`./network/member_${caso}`)({ client, internal_guild, guild_evento, cached_guild, registroAudita, id_alvo, guild_member, guild_executor, bot_member })
            }
        }

        setTimeout(() => { // Limpando a alteração do cache
            network_map.delete(registroAudita.targetId)
        }, 5000)
    }
}