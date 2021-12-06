const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "ceira",
    description: "Ceira Java",
    aliases: [ "java" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message) {
        const ceira = new MessageAttachment('arquivos/img/ceira.png');
        message.channel.send({ content: "Press :regional_indicator_f: :pensive: :fist:", files: [ceira] });

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};