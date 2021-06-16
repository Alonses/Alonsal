const { MessageEmbed } = require('discord.js');
const { version } = require('../../config.json');
const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = async ({client, message, args}) => {

    emoji_rainha = client.emojis.cache.get(emojis.elizabeth).toString();

    const embed = new MessageEmbed()
    .setTitle('Patinando entre as linhas bugadas :man_golfing:')
    .setColor(0x29BB8E)
    .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
    .setDescription('Este bot é patrocinado por Baidu e Renato\'s lanche, 40 tipos de lanche, hot dog, fastfood em 5 minutos, a maior casa de lanches de extrema, venha comer o renatão de 4, o lanche completo!\n\n:mailbox: Sugira comandos ou reporte bugs usando o **`.amail <sua msg>`**\n:page_facing_up: Utilize **`.ag`** ou **`.agit`** para visualizar o repositório do Alonsal.\n'+ emoji_rainha +' **`.ahub`** | **`.aserver`** - Entre no Hub multiconectado do Alonsal\n\n-----------------------------\n> OUTROS RECURSOS\nFrases do **`.aga`** | **`.agado`** são de total direito do @GadoDecider, todos os créditos vão a ele. ( https://twitter.com/GadoDecider )\n\nJá fui invocado _'+ args +'_ vezes :zany_face:\n [ _Versão '+ version + '_ ]')
    .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");

    message.channel.send(embed);
}