const Discord = require('discord.js');

module.exports = async ({message, args}) => {

    const embed = new Discord.MessageEmbed()
    .setTitle('Alonsal')
    .setColor('#29BB8E')
    .setDescription('> Viva a automação! :gear: :gear:\n-----------------------------\nEste bot é patrocinado por Baidu e Renato´s lanche, 40 tipos de lanche, hot dog, fastfood, a maior casa de lanches de extrema, venha comer o renatão⁴, o lanche completo!\n\nSugira comandos ou reporte bugs para o <@665002572926681128>\n\nJá fui invocado '+ args[0] +' vezes :zany_face:');

    message.channel.send(embed);
}