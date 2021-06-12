const { gifs } = require("../../arquivos/json/gifs/briga.json")

module.exports = async ({ message }) => {

    const num = Math.round((gifs.length - 1) * Math.random());
    
    if(num === 0)
        message.channel.send("ESFIHADA!");

    message.channel.send(gifs[num]);
}