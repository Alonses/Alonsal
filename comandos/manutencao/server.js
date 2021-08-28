module.exports = {
    name: "server",
    description: "O Hub multiconectado do alonsal",
    aliases: [ "hub" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
   
        let emoji_rainha = client.emojis.cache.get('854830529928757269').toString();

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Hub do Alonsal "+ emoji_rainha)
        .setURL('https://discord.gg/ZxHnxQDNwn')
        .setImage('https://i.imgur.com/NqmwCA9.png')
        .setDescription("Entre agora mesmo no meu servidor, seja para tirar dúvidas, ou usar os comandos, o server é liberado para todos!");

        const m = await message.channel.send(`${message.author} despachei o convite para o Hub alonsal no seu privado :handshake:`);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
};