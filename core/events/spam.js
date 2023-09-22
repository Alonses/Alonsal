const { EmbedBuilder, PermissionsBitField } = require("discord.js")

let bloqueia_operacao = 0

const usersmap = new Map(), usersrole = new Map()
const cached_messages = {}
const LIMIT = 4, DIFF = 5000

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

        const difference = message.createdTimestamp - lastMessage.createdTimestamp
        let msgcount = userdata.msgcount

        // Enviando mensagens com tempo aceitável
        if (difference > DIFF && lastMessage.content !== message.content) {

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

            if (msgcount === LIMIT) {

                // Spam confirmado
                if (!bloqueia_operacao) {
                    bloqueia_operacao = 1

                    // Nerfando o spam do servidor e excluindo as mensagens enviadas
                    nerfa_spam(client, user, guild, message)
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

async function nerfa_spam(client, user, guild, message) {

    let user_guild = await client.getMemberGuild(message, user.uid)

    if (!user_guild) { // Validando se o usuário saiu do servidor
        bloqueia_operacao = 0
        return
    }

    let tempo_timeout = 3600000 * 2 // 2 Horas
    let entradas_spamadas = ""

    // Listando as mensagens consideras SPAM e excluindo elas
    const user_messages = cached_messages[`${message.author.id}.${guild.sid}`]
    user_messages.forEach(internal_message => {
        entradas_spamadas += `-> ${internal_message.content}\n[ ${new Date(internal_message.createdTimestamp).toLocaleTimeString()} ]\n\n`
    })

    // Criando o embed de aviso para os moderadores
    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.spam.titulo"))
        .setColor(0xED4245)
        .setDescription(`${client.replace(client.tls.phrase(guild, "mode.spam.spam_aplicado", client.defaultEmoji("guard")), [user_guild, (tempo_timeout / 1000) / 60])}\n\`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``)
        .addFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n( ${user_guild} )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(guild, "mode.spam.vigencia")}**`,
                value: `<t:${client.timestamp() + (tempo_timeout / 1000)}:f>\n( <t:${client.timestamp() + (tempo_timeout / 1000)}:R> )`,
                inline: true
            }
        )

    if (user_guild.avatarURL({ dynamic: true, size: 2048 }))
        embed.setThumbnail(user_guild.avatarURL({ dynamic: true, size: 2048 }))

    user_guild.timeout(tempo_timeout, client.tls.phrase(guild, "mode.spam.justificativa_mute"))
        .then(async () => {

            client.notify(guild.logger.channel, { content: client.replace(client.tls.phrase(guild, "mode.spam.ping_spam"), user_guild), embed: embed })

            let msg_user = `${client.replace(client.tls.phrase(user, "mode.spam.silenciado"), await client.guilds().get(guild.sid).name)} \`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``

            if (cached_messages[`${message.author.id}.${guild.sid}`][0].content.includes("http") || cached_messages[`${message.author.id}.${guild.sid}`][0].content.includes("www"))
                msg_user += `\n\n${client.defaultEmoji("detective")} | ${client.tls.phrase(user, "mode.spam.aviso_links")}`

            client.sendDM(user, { data: `${client.defaultEmoji("guard")} | ${msg_user}` }, true)
        })
        .catch(async () => {

            // Erro por falta de permissão para poder castigar um usuário
            embed.setDescription(`${client.defaultEmoji("guard")} | ${client.replace(client.tls.phrase(guild, "mode.spam.falta_permissoes_1"), user_guild)}\n\`\`\`${entradas_spamadas.slice(0, 999)}\`\`\``)
                .setFields(
                    {
                        name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                        value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n( ${user_guild} )`,
                        inline: true
                    }
                )

            client.notify(guild.logger.channel, { content: `${client.defaultEmoji("guard")} | ${client.replace(client.tls.phrase(guild, "mode.spam.falta_permissoes_2"), user_guild)}`, embed: embed })
        })

    setTimeout(() => { // Busca as mensagens enviadas para excluir enviadas após a validação de spam
        remove_spam(client, user.uid, guild.sid, user_messages[0])
    }, 3000)
}

async function remove_spam(client, id_user, id_guild, user_message) {

    const guild = client.guilds(id_guild)

    // Filtra todas as mensagens no servidor que foram enviadas pelo usuário no último minuto
    guild.channels.cache.forEach(async channel => {

        if (channel.type === 0)
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
function registryMessage(guild, message) {

    if (!cached_messages[`${message.author.id}.${guild.sid}`])
        cached_messages[`${message.author.id}.${guild.sid}`] = []

    cached_messages[`${message.author.id}.${guild.sid}`].push(message)
}