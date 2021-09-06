module.exports = {
    name: "site",
    description: "O site do Alonsal",
    aliases: [ "website" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Site Alonsal")
        .setURL('https://alonsal.glitch.me')
        .setImage('https://i.imgur.com/6yac4yR.png')
        .setDescription(manutencao[4]["comandos"]);

        const m = await message.channel.send(`${message.author} `+ manutencao[4]["despachei"]);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
}