const { PermissionsBitField, AttachmentBuilder } = require('discord.js')
const { getGuild } = require('../database/schemas/Guild')

let TIMER = 300000
let timeout_broadcast = null

module.exports = async function ({ client, bot, message }) {

    const corpo_mail = {
        anexo: (message.attachments.first()),
        texto: message.content,
        author_nick: message.author.username
    }

    if (message.author.id === bot.transmission.author) {

        const status = await checa_broadcast(client, bot)

        // Autor enviando mensagem no canal que recebe broadcast
        if (message.channelId === bot.transmission.id_broad || status)
            return

        // Autor do comando enviando mensagens utilizando o bot
        const canal_alvo = await client.channels().get(bot.transmission.id_broad)

        if (!canal_alvo) // Canal enviado não existe mais ou está bloqueado
            return encerra_brodcast(client, bot)

        if (canal_alvo.type === 0 || canal_alvo.type === 5) {
            if (canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.ViewChannel) && canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.SendMessages)) {
                if (corpo_mail.anexo) {
                    const anexo = new AttachmentBuilder(corpo_mail.anexo.attachment)

                    if (corpo_mail.anexo && !corpo_mail.texto) // Apenas um anexo
                        canal_alvo.send({ files: [anexo] })
                    else // Texto e anexo
                        canal_alvo.send({ content: corpo_mail.texto, files: [anexo] })
                } else
                    canal_alvo.send({ content: corpo_mail.texto })

                // Gerencia o tempo que o broadcast ficará disponível
                timer_broadcast(client, bot)

            } else
                message.reply(":satellite: :octagonal_sign: | Eu não posso enviar mensagens neste canal escolhido para o broadcast!\nPor favor, tente um outro ID")
        }
    } else {

        // Outros usuários enviando mensagens no canal alvo
        const canal_alvo = await client.channels().get(bot.transmission.id_cast)

        if (corpo_mail.anexo) {
            const img_anexo = new AttachmentBuilder(corpo_mail.anexo.attachment)

            canal_alvo.send({ content: `${corpo_mail.author_nick} -> ${corpo_mail.texto}`, files: [img_anexo] })
        } else
            canal_alvo.send({ content: `${corpo_mail.author_nick} -> ${corpo_mail.texto}` })
    }
}

function timer_broadcast(client, bot) {

    // Reinicia o tempo de broadcast caso o autor envie uma mensagem, ou encerra o broadcast
    clearTimeout(timeout_broadcast)

    timeout_broadcast = setTimeout(async () => {

        const canal_alvo = await client.channels().get(bot.transmission.id_cast)

        bot.transmission.status = false
        await bot.save()

        canal_alvo.send({ content: `:robot: | O broadcast foi terminado devido a inatividade.\n<@${bot.transmission.author}>` })
    }, TIMER)
}

async function checa_broadcast(client, bot) {

    let status = 0

    // Encerra o broadcast entre canais por inatividade ou desconfiguração
    if (!timeout_broadcast && bot.transmission.status) {
        const canal_alvo = await client.channels().get(bot.transmission.id_cast)
        status = 1

        bot.transmission.status = false
        await bot.save()

        const guild = getGuild(canal_alvo.guild.id)

        if (client.decider(guild.conf?.broadcast, 0))
            canal_alvo.send({ content: `:robot: | O broadcast foi terminado devido a inatividade.\n<@${bot.transmission.author}>` })
    }

    return status
}

async function encerra_brodcast(client, bot, force) {

    clearTimeout(timeout_broadcast)

    // Forçando o encerramento do broadcast
    if (typeof force === "undefined") {

        const canal_alvo = await client.channels().get(bot.transmission.id_cast)
        canal_alvo.send({ content: `:robot: | O broadcast foi terminado pois o canal alvo não está mais acessível.\n<@${bot.transmission.author}>` })

        await bot.save()
    }
}

module.exports.checa_broadcast = checa_broadcast
module.exports.timer_broadcast = timer_broadcast
module.exports.encerra_brodcast = encerra_brodcast