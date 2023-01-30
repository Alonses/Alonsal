const cleverbot = require('cleverbot-free')

const conversations = []
let libera_conversacao = true

module.exports = async function ({ client, message, text }) {

    // Trava para responder apenas uma mensagem por vez
    if (libera_conversacao) {

        libera_conversacao = false
        message.channel.sendTyping()

        text = text.split("> ")[1] || text
        text = text.replace("alonsal", "").replace(client.id(), "").trim()

        cleverbot(text).then(res => {
            conversations.push(text)
            conversations.push(res.trim())

            setTimeout(() => {
                message.channel.send(res)

                if (conversations.length > 500) {
                    conversations.shift()
                    conversations.shift()
                }

                libera_conversacao = true
            }, Math.floor(900 + (Math.random() * 800)))
        })
    }
}