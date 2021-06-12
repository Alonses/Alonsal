const { gifs } = require("../../arquivos/json/gifs/cazalbe.json");

module.exports = async({message}) => {
    let num = Math.round(gifs.length * Math.random());
    
    if(num === gifs.length)
        num = 0;

    message.channel.send(gifs[num]);
}