module.exports = {
    name: "pulapredios",
    description: "O Jogo do pula!",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        emoji_pula = client.emojis.cache.get(emojis.pula).toString();

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Pula Prédios "+ emoji_pula)
        .setURL('https://gamejolt.com/games/pula-predios/613946')
        .setImage('https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp')
        .setDescription("O 1° Jogo criado pelo Slondo!\nQuão longe você consegue correr? Teste agora mesmo!")
        .setFooter('O jogo pode não rodar direito em celulares.');
        
        message.channel.send(embed);
    }
};