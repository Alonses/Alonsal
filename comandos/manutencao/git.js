const Discord = require('discord.js');

module.exports = async function({message}){

    const embed = new Discord.MessageEmbed()
    .setColor(0x29BB8E)
    .setAuthor('GitHub')
    .setTitle("> Repositório Alonsal")
    .setURL('https://github.com/brnd-21/Alonsal')
    .setImage('https://i.imgur.com/0tV3IQr.png')
    .setDescription("Contribua reportando bugs ou roubando códigos do Alonsal :pray_tone2:");

    message.channel.send(`${message.author}`, embed);
}
