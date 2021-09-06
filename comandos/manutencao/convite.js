module.exports = {
    name: "convite",
    description: "Convide o alonsal para um servidor",
    aliases: [ "cvv", "invite" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(manutencao[0]["titulo"])
        .setURL('https://discord.com/oauth2/authorize?client_id=833349943539531806&scope=bot&permissions=1614150720')
        .setThumbnail('https://i.imgur.com/K61ShGX.png')
        .setDescription(manutencao[0]["convite"])
        .setTimestamp()
        .setFooter("Alonsal");
        
        const m = await message.channel.send(`${message.author} `+ manutencao[0]["despachei"]);
        m.react('📫');
        
        client.users.cache.get(message.author.id).send(embed);
    }
};