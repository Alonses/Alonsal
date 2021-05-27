const Discord = require('discord.js');

module.exports = async ({message, args}) => {

    const embed = new Discord.MessageEmbed()
    .setTitle('Alonsal')
    .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
    .setColor('#29BB8E')
    .setDescription('> Viva a automação! :gear: :gear:\n-----------------------------\nEste bot é patrocinado por Baidu e Renato´s lanche, 40 tipos de lanche, hot dog, fastfood, a maior casa de lanches de extrema, venha comer o renatão⁴, o lanche completo!\n\nSugira comandos ou reporte bugs para o <@665002572926681128>\n\nJá fui invocado '+ args[0] +' vezes :zany_face:');

    message.channel.send(embed);
}