const { Events } = require('discord.js')

module.exports = async function ({ client }) {

    // Previne que o bot responda a eventos enquanto estiver atualizando comandos
    if (client.x.force_update || !client.x.logger) return

    console.log("🟠 | Ligando ouvintes de eventos")

    // Eventos de servidores ( entrada e saída )
    client.discord.on(Events.GuildCreate, guild => {
        require('./discord/guild/guild_join.js')({ client, guild })
    })

    client.discord.on(Events.GuildDelete, guild => {
        require('./discord/guild/guild_left.js')({ client, guild })
    })

    client.discord.on(Events.InviteCreate, invite => {
        require('./discord/guild/invite_created.js')({ client, invite })
    })

    client.discord.on(Events.InviteDelete, invite => {
        require('./discord/guild/invite_deleted.js')({ client, invite })
    })

    // Eventos de mensagens
    client.discord.on(Events.MessageDelete, message => {
        require('./discord/guild/message_deleted.js')({ client, message })
    })

    client.discord.on(Events.MessageUpdate, (old_msg, new_msg) => {
        require('./discord/guild/message_edited.js')(client, [old_msg, new_msg])
    })

    // Eventos de canais
    client.discord.on(Events.ChannelCreate, channel => {
        require('./discord/guild/channel_created.js')({ client, channel })
    })

    client.discord.on(Events.ChannelDelete, channel => {
        require('./discord/guild/channel_deleted.js')({ client, channel })
    })

    client.discord.on(Events.VoiceStateUpdate, (oldState, newState) => {
        require('./discord/guild/voice_channel.js')({ client, oldState, newState })
    })

    // Eventos de membros do servidor
    client.discord.on(Events.GuildMemberAdd, guild => {
        require('./discord/member/member_join.js')(client, guild)
    })

    client.discord.on(Events.GuildMemberRemove, guild => {
        require('./discord/member/member_left.js')(client, guild)
    })

    client.discord.on(Events.GuildMemberUpdate, (old_user, new_user) => {
        require('./discord/member/member.js')(client, [old_user, new_user])
    })

    // Eventos de gerenciamento de membros do servidor
    client.discord.on(Events.GuildBanAdd, ban => {
        require('./discord/guild/guild_ban_add.js')({ client, ban })
    })

    client.discord.on(Events.GuildBanRemove, ban => {
        require('./discord/guild/guild_ban_remove.js')({ client, ban })
    })

    // Evento do rate limit da API do discord
    client.discord.on("rateLimit", limit => {
        if (!process.env.channel_error) return

        const embed = client.create_embed({
            title: "> RateLimit :name_badge:",
            color: "vermelho",
            description: `Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``
        })

        client.notify(process.env.channel_error, { embeds: [embed] })
    })

    console.log("🟢 | Eventos acionados com sucesso")
}