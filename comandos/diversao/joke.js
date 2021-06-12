const jokes = require("./joke.json");

module.exports = async ({ message }) => {

    let num = 1 + Math.round(50 * Math.random());

    message.channel.send(":black_joker: "+ jokes[num]);
}