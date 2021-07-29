module.exports = {
    name: "ceira",
    description: "Ceira Java",
    aliases: [ "java" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { MessageAttachment } = require('discord.js');

        const ceira = new MessageAttachment('arquivos/img/ceira.png');
        message.channel.send("Press :regional_indicator_f: :pensive: :fist:", ceira);
    }
};