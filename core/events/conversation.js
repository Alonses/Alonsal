const { PermissionsBitField } = require('discord.js')

const cleverbot = require('cleverbot-free')

const conversations = []
let libera_conversacao = true

const sem_texto = [
    "Fala oq ce quer de uma vês disgrama",
    "ce ta querendo picanha e n ta sabendo pedir",
    ":eyes:",
    "vai durmi",
    "<@user_replace>",
    "cê é pago pa fazer isso? :clown:"
]

module.exports = async function ({ client, message, text, guild }) {

    if (guild.speaker.regional_limit) // Verificando se o servidor possui trava por canais para a conversação
        if (!guild.speaker.channels.includes(message.channel.id)) // O canal utilizado não faz parte dos canais permitidos
            return

    // Permissão para enviar mensagens no canal que foi chamado
    const canal_retorno = client.discord.channels.cache.get(message.channel.id)
    if (!canal_retorno.permissionsFor(client.id()).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]))
        return

    // Trava para responder apenas uma mensagem por vez
    if (libera_conversacao) {

        libera_conversacao = false
        message.channel.sendTyping()

        text = text.split("> ")[1] || text
        text = text.replace("alonsal", "").replace("alon", "").replace(client.id(), "").trim()

        if (text.trim() === "<@>" || text.trim() === "") {
            let texto = sem_texto[client.random(sem_texto)]

            if (texto.includes("user_replace"))
                texto = texto.replace("user_replace", message.author.id)

            libera_conversacao = true
            return message.channel.send({
                content: texto
            })
        }

        cleverbot(text).then(res => {
            conversations.push(text)
            conversations.push(res.trim())

            setTimeout(() => {
                message.channel.send({
                    content: res
                })

                if (conversations.length > 100) {
                    conversations.shift()
                    conversations.shift()
                }

                libera_conversacao = true
            }, Math.floor(client.random(800, 900)))
        })
    }
}