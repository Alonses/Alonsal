const { Guild } = require("discord.js");

module.exports = {
    name: "textoes",
    description: "textoes gratuitos",
    aliases: [ "text", "txt"],
    cooldown: 30,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();

        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { textoes } = require("../../arquivos/json/text/"+ idioma_servers[message.guild.id] +"/textoes.json");
        const num = Math.round((textoes.length - 1) * Math.random());

        let key = Object.keys(textoes[num]);

        message.channel.send(key);
        
        if(textoes[num][key] !== null)
            message.channel.send(textoes[num][key]);
    }
};