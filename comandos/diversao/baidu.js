const { MessageAttachment } = require('discord.js');

module.exports = async ({message}) => {

    const baidu = new MessageAttachment('arquivos/img/baidu.png');
    message.channel.send(`${message.author} Louvado seja!!`, baidu);
}