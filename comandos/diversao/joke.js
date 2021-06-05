const jokes = require("./joke.json");

module.exports = async ({ message }) => {

    var num = 1 + Math.round(49 * Math.random());
    
    num = num.toString();
    message.channel.send(":black_joker: "+ jokes[num]);
}