const Discord = require('discord.js');

module.exports = async function({client, caso, guild, local_server}){

    var ocasiao = "> Server update ( New )";
    var cor = 0x29BB8E;
    var qtd_users = "+"+ guild.memberCount;

    if(caso == "Left"){
        ocasiao = "> Server update ( Left )";
        cor = 0xd4130d;
        qtd_users = "-"+ guild.memberCount;
    }

    var embed_sv = new Discord.MessageEmbed()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ `${guild.id}` +"`\n:label: Server name: `"+ `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `"+ `${qtd_users}`+ "`")
        .setTimestamp();

    client.channels.cache.get(local_server).send(embed_sv);
}