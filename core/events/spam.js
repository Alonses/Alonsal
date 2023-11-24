const { PermissionsBitField } = require("discord.js")

const { getUserStrikes, spamTimeoutMap, defaultStrikes } = require("../database/schemas/Strikes")
const { registerSuspiciousLink, verifySuspiciousLink } = require("../database/schemas/Spam_link")

let bloqueia_operacao = 0

const usersmap = new Map(), usersrole = new Map()
const cached_messages = {}
const DIFF = 10000

module.exports = async function ({ client, message, user, guild }) {

    let user_guild

    if (usersrole.has(message.author.id)) {
        const userdata = usersrole.get(message.author.id)
        const { u_g } = userdata
        user_guild = u_g

        // Verificando se é um moderador no servidor, ignora membros com permissões de gerencia sobre usuários
        if (user_guild.permissions.has(PermissionsBitField.Flags.KickMembers) || user_guild.permissions.has([PermissionsBitField.Flags.BanMembers]))
            return
    } else
        user_guild = await client.getMemberGuild(message, user.uid)

    if (usersmap.has(message.author.id)) {

        const userdata = usersmap.get(message.author.id)
        const { lastMessage, timer } = userdata

        // const difference = message.createdTimestamp - lastMessage.createdTimestamp
        let msgcount = userdata.msgcount

        // Enviando mensagens com tempo aceitável
        if (/* difference > DIFF && */lastMessage.content !== message.content) {

            clearTimeout(timer)

            userdata.msgcount = 1
            userdata.lastMessage = message

            userdata.timer = setTimeout(async () => {
                usersmap.delete(message.author.id)
                usersrole.delete(message.author.id)
                cached_messages[`${message.author.id}.${guild.sid}`] = []
            }, DIFF)

            usersmap.set(message.author.id, userdata)

        } else {

            // Registrando a mensagem em cache para posterior exclusão
            registryMessage(guild, message)
            ++msgcount

            if (msgcount === guild.spam.trigger_amount) {

                // Spam confirmado
                if (!bloqueia_operacao) {
                    bloqueia_operacao = 1

                    // Nerfando o spam do servidor e excluindo as mensagens enviadas
                    nerfa_spam({ client, user, guild, message })
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
        }, DIFF)

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

async function nerfa_spam({ client, user, guild, message }) {

    let user_guild = await client.getMemberGuild(message, user.uid)
    let tempo_timeout = 7200, operacao = "mute"

    if (!user_guild) { // Validando se o usuário saiu do servidor
        bloqueia_operacao = 0
        return
    }

    if (guild?.spam.timeout) // Tempo de mute do servidor
        tempo_timeout = spamTimeoutMap[guild?.spam.timeout]

    // Servidor com progressão de strikes ativo
    if (guild?.spam.strikes) {
        let user_strikes = await getUserStrikes(user.uid)
        user_strikes.strikes++

        tempo_timeout = defaultStrikes[user_strikes.strikes] || null

        if (!tempo_timeout)
            operacao = "kick"

        await user_strikes.save()
    }

    // Requisições vindas de links suspeitos
    if (!cached_messages[`${message.author.id}.${guild.sid}`])
        registryMessage(guild, message)

    // Redirecionando o evento
    const guild_bot = await client.getMemberPermissions(guild.sid, client.id())
    const user_messages = cached_messages[`${message.author.id}.${guild.sid}`]
    await require(`./spam/${operacao}_user`)({ client, message, guild, user_messages, user, user_guild, guild_bot, tempo_timeout })

    setTimeout(() => { // Busca as mensagens enviadas para excluir enviadas após a validação de spam
        remove_spam(client, user.uid, guild.sid, user_messages[0])
    }, 4000)

    // Registrando o spam neutralizado no histórico
    const bot = await client.getBot(client.x.id)
    bot.persis.spam++

    // Verificando se o servidor possui o registro de links suspeitos ativo
    if (guild.spam.suspicious_links)
        if (user_messages[0].content.includes("http") || user_messages[0].content.includes("www")) {

            // Separando o link e registrando caso não tenha ainda
            const link = `http${user_messages[0].content.split("http")[1].split(" ")[0]}`
            const registro = await verifySuspiciousLink(link)

            if (!registro)
                await registerSuspiciousLink(link, guild.sid, client.timestamp())
        }

    await bot.save()
}

remove_spam = (client, id_user, id_guild, user_message) => {

    const guild = client.guilds(id_guild)

    // Filtra todas as mensagens no servidor que foram enviadas pelo usuário no último minuto
    guild.channels.cache.forEach(async channel => {

        if (channel.permissionsFor(client.id()).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]) && channel.type === 0)
            await channel.messages.fetch({ limit: 30 })
                .then(async messages => {

                    const userMessages = [] // Listando mensagens enviadas no último minuto
                    messages.filter(m => m.author.id === id_user && (m.createdTimestamp > user_message.createdTimestamp - 60000) || m.createdTimestamp === user_message.createdTimestamp).forEach(msg => userMessages.push(msg))
                    channel.bulkDelete(userMessages)

                    // Desbloqueando o bot para executar novamente a moderação de spam
                    bloqueia_operacao = 0
                    cached_messages[`${id_user}.${id_guild}`] = []
                })
    })
}

// Salva mensagens consideradas spam em cache
registryMessage = (guild, message) => {

    if (!cached_messages[`${message.author.id}.${guild.sid}`])
        cached_messages[`${message.author.id}.${guild.sid}`] = []

    cached_messages[`${message.author.id}.${guild.sid}`].push(message)
}

module.exports.nerfa_spam = nerfa_spam