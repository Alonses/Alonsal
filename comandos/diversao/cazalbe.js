const { gifs } = require("../../arquivos/json/gifs/cazalbe.json");

module.exports = async({message}) => {
    let num = Math.round((gifs.length - 1) * Math.random());
    
    message.channel.send(gifs[num]);
}