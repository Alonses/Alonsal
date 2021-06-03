const Discord = require('discord.js')

module.exports = async function({message, args}){

    ordena = ""
    for(var x = 0; x < args.length; x++){
        ordena += args[x] + " "
    }

    ordena = ordena.slice(0, -1).toLowerCase();

    texto = ordena.split('')
    texto = texto.reverse()

    var texto_ordenado = "";
    for(var i = 0; i < texto.length; i++){
        texto_ordenado += texto[i];
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(':arrow_backward: Sua mensagem ao contrário')
        .setAuthor(message.author.username)
        .setColor(0x29BB8E)
        .setDescription("`" + texto_ordenado + "`");

    message.channel.send(`${message.author}`, embed);
}