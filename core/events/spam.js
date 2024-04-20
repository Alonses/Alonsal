const { PermissionsBitField } = require("discord.js")

const { getUserStrikes, spamTimeoutMap } = require("../database/schemas/Strikes")
const { registerSuspiciousLink } = require("../database/schemas/Spam_link")
const { listAllGuildStrikes, getGuildStrike } = require("../database/schemas/Strikes_guild")

let bloqueia_operacao = 0

const usersmap = new Map(), usersrole = new Map()
const cached_messages = {}

module.exports = async function ({ client, message, guild }) {

    let user_guild

    // Tempo minimo para manter as mensagens salvas em cache no servidor
    let tempo_spam = guild.spam.trigger_amount < 5 ? 20000 : guild.spam.trigger_amount * 3000

    if (usersrole.has(message.author.id)) {
        const userdata = usersrole.get(message.author.id)
        const { u_g } = userdata
        user_guild = u_g

        // User is not saved in cache removing him from the list
        if (!user_guild) return

        // Checking if he is a moderator on the server ignores members with manage permissions if the server does not allow Alonsal to manage moderators
        if (!guild?.spam.manage_mods && user_guild.permissions.has(PermissionsBitField.Flags.KickMembers || PermissionsBitField.Flags.BanMembers)) return
    } else
        user_guild = await client.getMemberGuild(message, message.author.id)

    if (usersmap.has(message.author.id)) {

        const userdata = usersmap.get(message.author.id)
        const { lastMessage, timer } = userdata

        // const difference = message.createdTimestamp - lastMessage.createdTimestamp
        let msgcount = userdata.msgcount

        // Sending different messages
        if (lastMessage.content !== message.content) {

            clearTimeout(timer)

            userdata.msgcount = 1
            userdata.lastMessage = message

            userdata.timer = setTimeout(async () => {
                usersmap.delete(message.author.id)
                usersrole.delete(message.author.id)
                cached_messages[`${message.author.id}.${guild.sid}`] = []
            }, tempo_spam)

            usersmap.set(message.author.id, userdata)

        } else {

            // Registering the message in cache for later deletion
            registryMessage(guild, message)
            ++msgcount

            if (msgcount === guild.spam.trigger_amount) {

                // Confirmed spam
                if (!bloqueia_operacao) {
                    bloqueia_operacao = 1

                    // Nerfing server spam and deleting sent messages
                    nerfa_spam({ client, message, guild })
                }
            } else {
                userdata.msgcount = msgcount
                usersmap.set(message.author.id, userdata)
            }
        }
    } else {

        let fn = setTimeout(async () => {
            usersmap.delete(message.author.id)
            usersrole.delete(message.author.id)
            cached_messages[`${message.author.id}.${guild.sid}`] = []
        }, tempo_spam)

        usersmap.set(message.author.id, {
            msgcount: 1,
            lastMessage: message,
            timer: fn
        })

        usersrole.set(message.author.id, {
            u_g: user_guild
        })
    }
}

async function nerfa_spam({ client, message, guild }) {

    let user_guild = await client.getMemberGuild(message, message.author.id)
    let tempo_timeout = spamTimeoutMap[2]

    let strikes = await listAllGuildStrikes(message.guild.id)
    let strike_aplicado = { action: "member_mute", timeout: 2 }

    if (strikes.length < 1) // Creating a new strike for the server
        await getGuildStrike(message.guild.id, 0)
    else
        strike_aplicado = strikes[0]

    if (strikes.length > 0) // Server mute time
        tempo_timeout = spamTimeoutMap[strike_aplicado.timeout]

    if (guild?.spam.strikes) { // Server with active strike progression
        let user_strikes = await getUserStrikes(message.author.id)

        strike_aplicado = strikes[user_strikes.strikes] || strikes[strikes.length - 1]

        user_strikes.strikes++
        await user_strikes.save()
    }

    // Requests coming from suspicious links
    if (!cached_messages[`${message.author.id}.${guild.sid}`] || cached_messages[`${message.author.id}.${guild.sid}`].length < 1) {

        cached_messages[`${message.author.id}.${guild.sid}`] = []
        cached_messages[`${message.author.id}.${guild.sid}`].push(message)

        strike_aplicado = { action: "member_mute", timeout: 2 }
    }

    if (!strike_aplicado?.action) // No defined operation
        strike_aplicado = { action: "member_mute", timeout: 2 }

    // Redirecting the event
    const guild_bot = await client.getMemberGuild(guild.sid, client.id())
    const user_messages = cached_messages[`${message.author.id}.${guild.sid}`]
    const user = await client.getUser(message.author.id)

    await require(`./spam/${strike_aplicado.action.replace("_2", "")}`)({ client, message, guild, strike_aplicado, user_messages, user, user_guild, guild_bot, tempo_timeout })

    if (strike_aplicado.role) { // Current Strike adds a role

        // Checking bot permissions on the server
        if (await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.Administrator])) {

            // Assigning the role to the user who received the strike
            let role = interaction.guild.roles.cache.get(strike_aplicado.role)

            if (role.editable) { // Checking if the role is editable
                const membro_guild = await client.getMemberGuild(interaction, id_alvo)

                membro_guild.roles.add(role).catch(console.error)
            }
        } else
            client.notify(guild.spam.channel || guild.logger.channel, { // No permission to manage roles
                content: client.tls.phrase(guild, "mode.spam.sem_permissao_cargos", 7),
            })
    }

    setTimeout(() => { // Search sent messages to delete sent after spam validation
        remove_spam(client, message.author.id, guild.sid, user_messages[0])
    }, 4000)

    // Registering neutralized spam in history
    const bot = await client.getBot(client.x.id)
    bot.persis.spam++

    if (guild.spam.suspicious_links && user_messages.length > 0) { // Checking if the server has the suspicious links registry active

        const link = `${user_messages[0].content} `.match(client.cached.regex)

        if (link.length > 0) {

            const registrados = await registerSuspiciousLink(link[0], guild.sid, client.timestamp()) || []

            // Registering suspicious links that are not saved yet and notifying about the addition of a new suspicious link to the Alonsal database and the original server
            if (registrados.length > 0) {
                client.notify(process.env.channel_feeds, { content: `:link: :inbox_tray: | A new suspicious link has been saved!\n( \`${registrados.join("\n")}\` )` })
                client.notify(guild.spam.channel || guild.logger.channel, { content: client.tls.phrase(guild, "mode.link_suspeito.detectado", [44, 43], registrados.join("\n")) })
            }
        }
    }

    await bot.save()
}

remove_spam = (client, id_user, id_guild, user_message) => {

    const guild = client.guilds(id_guild)

    // Filters all messages on the server that were sent by the user in the last minute
    guild.channels.cache.forEach(async channel => {

        if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], channel) && channel.type === 0)
            await channel.messages.fetch({ limit: 30 })
                .then(async messages => {

                    const userMessages = [] // Listing messages sent in the last minute
                    messages.filter(m => m.author.id === id_user && (m.createdTimestamp > user_message.createdTimestamp - 60000) || m.createdTimestamp === user_message.createdTimestamp && m.deletable).forEach(msg => userMessages.push(msg))
                    channel.bulkDelete(userMessages)
                        .catch(() => console.error)

                    // Unblocking the bot to rerun spam moderation
                    bloqueia_operacao = 0
                    cached_messages[`${id_user}.${id_guild}`] = []
                })
    })
}

// Saves messages considered spam in cache
registryMessage = (guild, message) => {

    if (!cached_messages[`${message.author.id}.${guild.sid}`])
        cached_messages[`${message.author.id}.${guild.sid}`] = []

    cached_messages[`${message.author.id}.${guild.sid}`].push(message)
}

module.exports.nerfa_spam = nerfa_spam