const { MessageEmbed } = require('discord.js');
const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "pulapredios",
    description: "O Jogo do pula!",
    aliases: [ "pula", "jogo" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { jogos } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        const emoji_pula = client.emojis.cache.get(emojis.pula).toString();

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Pula Prédios "+ emoji_pula)
        .setURL('https://gamejolt.com/games/pula-predios/613946')
        .setImage('https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp')
        .setDescription(jogos[0]["conteudo"])
        .setFooter(jogos[0]["rodape"]);
        
        message.reply({ embeds: [embed] });
    }
};