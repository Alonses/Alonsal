const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "baidu",
    description: "Louvado seja!",
    aliases: [ "du" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message){

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const baidu = new MessageAttachment('arquivos/img/baidu.png');
        message.channel.send({ content: diversao[0]["baidu"], files: [baidu] });

        // .then(() => {
        //     const permissions = message.channel.permissionsFor(message.client.user);

        //     if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
        //         message.delete();
        // });
    }
};