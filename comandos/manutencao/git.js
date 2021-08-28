module.exports = {
    name: "git",
    description: "O repositório do Alonsal",
    aliases: [ "g", "repositorio" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setAuthor('GitHub')
        .setTitle("> Repositório Alonsal")
        .setURL('https://github.com/brnd-21/Alonsal')
        .setImage('https://i.imgur.com/0tV3IQr.png')
        .setDescription("Contribua reportando bugs ou roubando códigos do Alonsal :pray_tone2:");

        const m = await message.channel.send(`${message.author} despachei a ceira mais recente no seu privado :handshake:`);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
};