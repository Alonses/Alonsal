module.exports = {
    name: "server",
    description: "O Hub multiconectado do alonsal",
    aliases: [ "hub" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const { MessageEmbed } = require('discord.js');
   
        let emoji_rainha = client.emojis.cache.get('854830529928757269').toString();

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(manutencao[6]["hubalosal"] +" "+ emoji_rainha)
        .setURL('https://discord.gg/ZxHnxQDNwn')
        .setImage('https://i.imgur.com/NqmwCA9.png')
        .setDescription(manutencao[6]["info"]);

        const m = await message.channel.send(`${message.author} `+ manutencao[6]["despachei"]);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
};