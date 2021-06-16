const { messages } = require("../../arquivos/json/text/joke.json")

module.exports = async ({message}) => {

    const num = Math.round((messages.length - 1) * Math.random());
    message.channel.send(":black_joker: "+ messages[num]);
}