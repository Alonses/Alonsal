const { gifs } = require("../../arquivos/json/gifs/cazalbe.json");

module.exports = {
    name: "cazalbe",
    description: "Cazalbé!",
    aliases: [ "caz" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message) {
                
        message.channel.send(gifs[Math.round((gifs.length - 1) * Math.random())]).then(() => {
            const permissions = message.channel.permissionsFor(message.client.user);

            if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
                message.delete();
        });
    }
    // slash_params: [{
    //     name: "cazalbe",
    //     description: "Cazalbe!"
    // }],
    // slash(client, handler, data, params) {
    //     handler.postSlashMessage(data, gifs[Math.round((gifs.length - 1) * Math.random())]);
    // }
};