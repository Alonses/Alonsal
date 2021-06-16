const { MessageEmbed } = require('discord.js');

module.exports = async ({client, message}) => {

    function emoji(id){
        return client.emojis.cache.get(id).toString();
    }

    emoji_pula = emoji('824127093751283722')

    const embed = new MessageEmbed()
    .setColor(0x29BB8E)
    .setTitle("> Pula Prédios")
    .setURL('https://gamejolt.com/games/pula-predios/613946')
    .setImage('https://m.gjcdn.net/game-header/1300/613946-crop0_236_1366_606-xqiv88ik-v4.webp')
    .setDescription("O 1° Jogo criado pelo Slondo!\nQuão longe você consegue correr? Teste agora mesmo"+ emoji_pula)
    .setFooter('O jogo pode não rodar direito em celulares.');
    // <a:Pula2:824127093751283722>
    message.channel.send(embed);
}