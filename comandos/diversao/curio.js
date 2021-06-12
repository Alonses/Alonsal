const { messages } = require("../../arquivos/json/text/curio.json")

module.exports = async ({ message }) => {

    const num = Math.round((messages.length - 1) * Math.random());

    let key = Object.keys(messages[num]);

    message.channel.send(":clipboard: "+ key);
    
    if(messages[num][key] !== null)
        message.channel.send(messages[num][key]);
}