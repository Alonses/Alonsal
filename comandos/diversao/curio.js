const { messages } = require("../../arquivos/json/text/curio.json")

module.exports = async ({ message }) => {

    let num = 1 + Math.round(messages.length * Math.random());

    let key = Object.keys(messages[num]);

    message.channel.send(":clipboard: "+ key);
    
    if(messages[num][key] !== null)
        message.channel.send(messages[num][key]);
}