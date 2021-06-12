const { gifs } = require("../../arquivos/json/gifs/briga.json")

module.exports = async ({ message }) => {

    let num = Math.round(gifs.length * Math.random());
    
    if(num === gifs.length)
        num = 0;

    if(num === 0)
        message.channel.send("ESFIHADA!");

    message.channel.send(gifs[num]);
}