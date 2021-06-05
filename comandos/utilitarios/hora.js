const Discord = require('discord.js');

module.exports = async({message}) => {

    const hora = new Discord.MessageAttachment('arquivos/sng/hora_certa.mp3');
    message.channel.send(`${message.author} Hora certa!`, hora);
}