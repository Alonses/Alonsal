const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "convite",
    description: "Convide o alonsal para um servidor",
    aliases: [ "cvv", "invite" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

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
        
        client.users.cache.get(message.author.id).send({ embeds: [embed] });
    }
};