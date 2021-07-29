module.exports = {
    name: "suporte",
    description: "Dê suporte ao Alonsal",
    aliases: [ "support", "patrocinio", "money", "premium" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        let vergonha = emoji(emojis.vergonha);
        let bolo = emoji(emojis.bolo);

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Apoie o Alonsal! "+ bolo)
        .setURL("https://picpay.me/slondo")
        .setDescription("Escaneie ou clique no Titulo acima para doar e ajudar a manter e desenvolver o Alonsal!\nToda ajuda é ultra Bem-Vinda ;D")
        .setImage("https://i.imgur.com/incYvy2.jpg");

        message.channel.send(`${message.author} Obrigado pela consideração!\nDespachei as infos no seu privado `+ vergonha);
        // m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
};