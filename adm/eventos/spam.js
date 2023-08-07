const { EmbedBuilder } = require("discord.js")
const { getUserMessages, dropUserMessage, dropAllUserMessages, createMessage } = require("../database/schemas/Message")

let bloqueia_operacao = 0

module.exports = async function ({ client, message, user, guild }) {

    let repeticoes = 0, ult_message = "", ult_timestamp = 0, texto = ""

    const conteudo = message.content.trim().toLowerCase()
    await createMessage(user.uid, guild.sid, message.channelId, message.id, conteudo, message.createdTimestamp)

    const messages = await getUserMessages(user.uid, guild.sid)

    if (messages.length > 0) {
        messages.forEach(internal_message => {

            if (ult_message !== 0)
                if (((ult_message === internal_message.content) && ((ult_timestamp - internal_message.timestamp) < 1000)) || ((ult_timestamp - internal_message.timestamp) < 400)) {
                    repeticoes++

                    texto += `-> ${internal_message.content} \n\n`
                }

            ult_message = internal_message.content
            ult_timestamp = internal_message.timestamp
        })
    }

    if (messages.length > 10 && repeticoes < 2)
        await dropUserMessage(user.uid, messages[9].mid)

    if (repeticoes > 4)
        nerfa_spam(client, user, guild, message, texto)
}

async function nerfa_spam(client, user, guild, message, texto) {

    if (!bloqueia_operacao) {

        bloqueia_operacao = 1

        let user_guild = await client.getUserGuild(message, user.uid)
        let tempo_timeout = 3600000 // 1 Hora

        const embed = new EmbedBuilder()
            .setTitle("> Prevenção de Spam")
            .setColor(0xED4245)
            .setDescription(`${client.defaultEmoji("guard")} | O usuário ${user_guild} foi mutado por \`${(tempo_timeout / 1000) / 60} minutos\` devido à repetidas\nmensagens enviadas em tempos aproximados.\n\`\`\`${texto.slice(0, 999)}\`\`\``)
            .addFields(
                {
                    name: `${client.defaultEmoji("person")} **Membro**`,
                    value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n( ${user_guild} )`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("calendar")} **Vigência**`,
                    value: `<t:${client.timestamp() + (tempo_timeout / 1000)}:f>\n( <t:${client.timestamp() + (tempo_timeout / 1000)}:R> )`,
                    inline: true
                }
            )

        const url_avatar = user_guild.avatarURL({ dynamic: true, size: 2048 })

        if (url_avatar)
            embed.setThumbnail(url_avatar)

        user_guild.timeout(tempo_timeout, "Fazendo spam no servidor")
            .then(async () => {

                client.notify(guild.logger.channel, { content: `@here ${user_guild} foi colocado em castigo devido a spam`, embed: embed })
                const messages = await getUserMessages(user.uid, guild.sid)

                // Excluindo as mensagens enviadas pelo usuário que foram consideradas como spam
                messages.forEach(message => {
                    client.discord.channels.cache.get(message.cid).messages.fetch(message.mid).then(msg => msg.delete())
                })

                let msg_user = `Você foi silenciado no servidor \`${await client.guilds().get(guild.sid).name}\` devido a várias mensagens consideradas como spam\nAs mensagens que foram consideradas como spam são as seguintes: \`\`\`${texto.slice(0, 999)}\`\`\``

                if (messages[0].content.includes("https://discord.gg/"))
                    msg_user += `\n\n${client.defaultEmoji("detective")} | Sua conta pode estar nas mãos de outras pessoas, caso veja esta mensagem, verifique suas configurações de segurança, alterando sua senha, ativando verificações em 2 etapas e desconectando sua conta de aparelhos desconhecidos para que não perca o acesso a conta.`

                client.sendDM(user, { data: `${client.defaultEmoji("guard")} | ${msg_user}` }, true)

                await dropAllUserMessages(user.uid, guild.sid)
                bloqueia_operacao = 0
            })
            .catch(async () => {

                // Erro por falta de permissão para poder castigar um usuário
                embed.setDescription(`${client.defaultEmoji("guard")} | Não foi possível interromper um spam do usuário ${user_guild} por falta de permissões do bot\nAs mensagens enviadas consideradas spam são as seguintes.\n\`\`\`${texto.slice(0, 999)}\`\`\``)
                    .setFields(
                        {
                            name: `${client.defaultEmoji("person")} **Membro**`,
                            value: `${client.emoji("icon_id")} \`${user_guild.id}\`\n( ${user_guild} )`,
                            inline: true
                        }
                    )

                client.notify(guild.logger.channel, { content: `${client.defaultEmoji("guard")} | Não foi possível silenciar o usuário ${user_guild} devido a falta de permissões @here\nGaranta que eu tenha a permissão \`Membros de castigo\` e que meu cargo esteja acima dos demais cargos na lista de cargos, para que eu possa previnir spam's de usuários abaixo do nível.`, embed: embed })

                await dropAllUserMessages(user.uid, guild.sid)
                bloqueia_operacao = 0
            })
    }
}