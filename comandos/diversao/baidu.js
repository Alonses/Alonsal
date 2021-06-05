const Discord = require('discord.js');

module.exports = async({message}) => {

    const baidu = new Discord.MessageAttachment('arquivos/img/baidu.png');
    message.channel.send(`${message.author} Louvado seja!!`, baidu);
}