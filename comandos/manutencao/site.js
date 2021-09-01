module.exports = {
    name: "site",
    description: "O site do Alonsal",
    aliases: [ "website" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Site Alonsal")
        .setURL('https://alonsal.glitch.me')
        .setImage('https://i.imgur.com/6yac4yR.png')
        .setDescription("Veja os comandos, me convide ou acesse meu servidor pelo site!");

        const m = await message.channel.send(`${message.author} despachei o link do meu site no seu privado :handshake:`);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
}