const cleverbot = require('cleverbot-free')

const conversations = []
let libera_conversacao = true

const sem_texto = [
    "Fala oq ce quer de uma vês disgrama",
    "ce ta querendo picanha e n ta sabendo pedir",
    ":eyes:",
    "vai durmi",
    "<@user_replace>"
]

module.exports = async function ({ client, message, text }) {

    // Trava para responder apenas uma mensagem por vez
    if (libera_conversacao) {

        libera_conversacao = false
        message.channel.sendTyping()

        text = text.split("> ")[1] || text
        text = text.replace("alonsal", "").replace(client.id(), "").trim()

        if (text.trim() == "<@>" || text.trim() == "") {
            let texto = sem_texto[Math.floor(sem_texto.length * Math.random())]

            if (texto.includes("user_replace"))
                texto = texto.replace("user_replace", message.author.id)

            libera_conversacao = true
            return message.channel.send(texto)
        }

        cleverbot(text).then(res => {
            conversations.push(text)
            conversations.push(res.trim())

            setTimeout(() => {
                message.channel.send(res)

                if (conversations.length > 100) {
                    conversations.shift()
                    conversations.shift()
                }

                libera_conversacao = true
            }, Math.floor(900 + (Math.random() * 800)))
        })
    }
}