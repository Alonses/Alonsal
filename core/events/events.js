const { EmbedBuilder } = require('discord.js')

module.exports = async function ({ client }) {

    // Previne que o bot responda a eventos enquanto estiver atualizando comandos
    if (client.x.force_update || !client.x.logger) return

    console.log("🟠 | Ligando eventos")

    // Eventos de servidores ( entrada e saída )
    client.discord.on("guildCreate", guild => {
        require('./discord/guild_join.js')({ client, guild })
    })

    client.discord.on("guildDelete", guild => {
        require('./discord/guild_left.js')({ client, guild })
    })

    // Eventos de mensagens
    client.discord.on("messageDelete", message => {
        require('./discord/message_deleted.js')({ client, message })
    })

    client.discord.on("messageUpdate", (old_msg, new_msg) => {
        require('./discord/message_edited.js')(client, [old_msg, new_msg])
    })

    client.discord.on("channelDelete", channel => {
        require('./discord/channel_deleted.js')({ client, channel })
    })

    client.discord.on("channelCreate", channel => {
        require('./discord/channel_created.js')({ client, channel })
    })

    // Eventos para atualização de usuário
    client.discord.on("guildMemberUpdate", (old_user, new_user) => {
        require('./discord/member.js')(client, [old_user, new_user])
    })

    // Eventos de membros do servidor
    client.discord.on("guildMemberAdd", guild => {
        require('./discord/member_join.js')(client, guild)
    })

    client.discord.on("guildMemberRemove", guild => {
        require('./discord/member_left.js')(client, guild)
    })

    // Evento do rate limit da API do discord
    client.discord.on("rateLimit", limit => {
        if (!process.env.channel_error) return

        const embed = new EmbedBuilder()
            .setTitle("> RateLimit :name_badge:")
            .setColor(0xff0000)
            .setDescription(`Command: \`${ult_comando}\`\nTimeout: \`${limit.timeout}\`\nLimit: \`${limit.limit}\`\nMethod: \`${limit.method}\`\n\nPath: \`${limit.path}\`\nRoute: \`${limit.route}\``)

        client.notify(process.env.channel_error, { embeds: [embed] })
    })

    console.log("🟢 | Eventos acionados com sucesso")
}