const Discord = require('discord.js')

module.exports = async({message}) => {

    const ceira = new Discord.MessageAttachment('arquivos/img/ceira.png');
    message.channel.send("Press :regional_indicator_f: :pensive: :fist:", ceira);
}
