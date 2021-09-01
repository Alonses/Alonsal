module.exports = {
    name: "convite",
    description: "Convide o alonsal para um servidor",
    aliases: [ "cvv", "invite" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const { MessageEmbed } = require('discord.js');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Ó Abre alas que eu queru passsaa :notes:")
        .setURL('https://discord.com/oauth2/authorize?client_id=833349943539531806&scope=bot&permissions=1614150720')
        .setThumbnail('https://i.imgur.com/K61ShGX.png')
        .setDescription("Convide-me clicando aqui!")
        .setTimestamp()
        .setFooter("Alonsal");
        
        const m = await message.channel.send(`${message.author} despachei o convite no seu privado :love_you_gesture:`);
        m.react('📫');
        
        client.users.cache.get(message.author.id).send(embed);
    }
};