const { PermissionsBitField } = require("discord.js")

const { getUserStrikes, spamTimeoutMap } = require("../database/schemas/Strikes")
const { registerSuspiciousLink, verifySuspiciousLink } = require("../database/schemas/Spam_link")
const { listAllGuildStrikes, getGuildStrike } = require("../database/schemas/Strikes_guild")

let bloqueia_operacao = 0

const usersmap = new Map(), usersrole = new Map()
const cached_messages = {}
const DIFF = 10000

module.exports = async function ({ client, message, guild }) {

    let user_guild

    if (usersrole.has(message.author.id)) {
        const userdata = usersrole.get(message.author.id)
        const { u_g } = userdata
        user_guild = u_g

        // usuário não está salvo em cache removendo ele da lista
        if (!user_guild) return

        // Verificando se é um moderador no servidor, ignora membros com permissões de gerenciamento caso o servidor não permita o Alonsal gerenciar moderadores
        if (!guild?.spam.manage_mods && user_guild.permissions.has(PermissionsBitField.Flags.KickMembers || PermissionsBitField.Flags.BanMembers)) return
    } else
        user_guild = await client.getMemberGuild(message, message.author.id)

    if (usersmap.has(message.author.id)) {

        const userdata = usersmap.get(message.author.id)
        const { lastMessage, timer } = userdata

        // const difference = message.createdTimestamp - lastMessage.createdTimestamp
        let msgcount = userdata.msgcount

        // Enviando mensagens com tempo aceitável
        if (lastMessage.content !== message.content) {

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

async function nerfa_spam({ client, message, guild }) {

    let user_guild = await client.getMemberGuild(message, message.author.id)
    let tempo_timeout = spamTimeoutMap[2]

    let strikes = await listAllGuildStrikes(message.guild.id)
    let strike_aplicado = { action: "member_mute", timeout: 2 }

    if (strikes.length < 1) // Criando um novo strike para o servidor
        await getGuildStrike(message.guild.id, 0)
    else
        strike_aplicado = strikes[0]

    if (strikes.length > 0) // Tempo de mute do servidor
        tempo_timeout = spamTimeoutMap[strike_aplicado.timeout]

    if (guild?.spam.strikes) { // Servidor com progressão de strikes ativo
        let user_strikes = await getUserStrikes(message.author.id)

        strike_aplicado = strikes[user_strikes.strikes] || strikes[strikes.length - 1]

        user_strikes.strikes++
        await user_strikes.save()
    }

    // Requisições vindas de links suspeitos
    if (!cached_messages[`${message.author.id}.${guild.sid}`] || cached_messages[`${message.author.id}.${guild.sid}`].length < 1) {

        cached_messages[`${message.author.id}.${guild.sid}`] = []
        cached_messages[`${message.author.id}.${guild.sid}`].push(message)

        strike_aplicado = { action: "member_mute", timeout: 2 }
    }

    if (!strike_aplicado.action) // Sem operação definida
        strike_aplicado.action = "member_warn"

    // Redirecionando o evento
    const guild_bot = await client.getMemberGuild(guild.sid, client.id())
    const user_messages = cached_messages[`${message.author.id}.${guild.sid}`]
    const user = await client.getUser(message.author.id)

    await require(`./spam/${strike_aplicado.action.replace("_2", "")}`)({ client, message, guild, strike_aplicado, user_messages, user, user_guild, guild_bot, tempo_timeout })

    if (strike_aplicado.role) { // Strike atual acrescenta um cargo

        // Verificando permissões do bot no servidor
        if (await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.Administrator])) {

            // Atribuindo o cargo ao usuário que recebeu o strike
            let role = interaction.guild.roles.cache.get(strike_aplicado.role)

            if (role.editable) { // Verificando se o cargo é editável
                const membro_guild = await client.getMemberGuild(interaction, id_alvo)

                membro_guild.roles.add(role).catch(console.error)
            }
        } else
            client.notify(guild.spam.channel || guild.logger.channel, { // Sem permissão para gerenciar cargos
                content: client.tls.phrase(guild, "mode.spam.sem_permissao_cargos", 7),
            })
    }

    setTimeout(() => { // Busca as mensagens enviadas para excluir enviadas após a validação de spam
        remove_spam(client, message.author.id, guild.sid, user_messages[0])
    }, 4000)

    // Registrando o spam neutralizado no histórico
    const bot = await client.getBot(client.x.id)
    bot.persis.spam++

    if (guild.spam.suspicious_links) { // Verificando se o servidor possui o registro de links suspeitos ativo
        let text = `${user_messages[0].content} `

        if (text.match(/[A-Za-z]+\.[A-Za-z0-9]{2,10}(?:\/[^\s/]+)*\/?\s/gi)) {

            let link = text.match(/[A-Za-z0-9]+\-[A-Za-z]+\.[A-Za-z0-9]{2,10}(?:\/[^\s/]+)*\/?\s/gi || /[A-Za-z]+\.[A-Za-z0-9]{2,10}(?:\/[^\s/]+)*\/?\s/gi)
            link = link.map(link => link.replace(" ", ""))

            if (await verifySuspiciousLink(link, true)) { // Verificando se o link já está registrado

                await registerSuspiciousLink(link, guild.sid, client.timestamp())

                let links = link.map(link => link.split("").join(" "))

                // Notificando sobre a adição de um novo link suspeito ao banco do Alonsal e ao servidor original
                client.notify(process.env.channel_feeds, { content: `:link: :inbox_tray: | Um novo link suspeito foi salvo!\n( \`${links.join("\n")}\` )` })

                client.notify(guild.spam.channel || guild.logger.channel, { content: client.tls.phrase(guild, "mode.link_suspeito.detectado", [44, 43], links.join("\n")) })
            }
        }
    }

    await bot.save()
}

remove_spam = (client, id_user, id_guild, user_message) => {

    const guild = client.guilds(id_guild)

    // Filtra todas as mensagens no servidor que foram enviadas pelo usuário no último minuto
    guild.channels.cache.forEach(async channel => {

        if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], channel) && channel.type === 0)
            await channel.messages.fetch({ limit: 30 })
                .then(async messages => {

                    const userMessages = [] // Listando mensagens enviadas no último minuto
                    messages.filter(m => m.author.id === id_user && (m.createdTimestamp > user_message.createdTimestamp - 60000) || m.createdTimestamp === user_message.createdTimestamp && m.deletable).forEach(msg => userMessages.push(msg))
                    channel.bulkDelete(userMessages)
                        .catch(() => console.error)

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