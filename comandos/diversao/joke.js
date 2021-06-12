const { messages } = require("../../arquivos/json/text/joke.json")

module.exports = async ({ message }) => {

    const num = 1 + Math.round(50 * Math.random());

    message.channel.send(":black_joker: "+ messages[num]);
}