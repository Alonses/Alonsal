const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "back_rank",
    description: "",
    aliases: [ "bkr" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
 
        if(message.author.id !== "665002572926681128") return

        const rank = new MessageAttachment("arquivos/data/rank/ranking.json");
        message.channel.send({files: [rank]});
    }
}