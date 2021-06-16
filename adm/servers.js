const { MessageEmbed } = require('discord.js');
const { id_canais } = require('../config.json');

module.exports = async function({client, caso, guild}){

    var ocasiao = "> Server update ( New )";
    var cor = 0x29BB8E;
    var qtd_users = "+"+ guild.memberCount;

    if(caso === "Left"){
        ocasiao = "> Server update ( Left )";
        cor = 0xd4130d;
        qtd_users = "-"+ guild.memberCount;
    }

    const embed_sv = new MessageEmbed()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(":globe_with_meridians: (ID) Server: `" + `${guild.id}` + "`\n:label: Server name: `" + `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `" + `${qtd_users}` + "`")
        .setTimestamp();

    client.channels.cache.get(id_canais[0]).send(embed_sv);
}