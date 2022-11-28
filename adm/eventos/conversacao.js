const cleverbot = require('cleverbot-free')

const conversations = []

module.exports = async function ({ client, message, text }) {

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
        }, Math.floor(900 + (Math.random() * 800)))
    })
}