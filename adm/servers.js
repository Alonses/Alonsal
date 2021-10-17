const { MessageEmbed } = require('discord.js');
const { id_canais } = require('../config.json');

module.exports = async ({client, caso, guild}) => {

    let ocasiao = "> Server update ( New )";
    let cor = 0x29BB8E;
    let qtd_users = "+ "+ guild.memberCount - 1;
    let canais = "+ "+ guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size;

    if(caso === "Left"){
        ocasiao = "> Server update ( Left )";
        cor = 0xd4130d;
        qtd_users = "- "+ guild.memberCount - 1;
        canais = "?";
    }

    const embed_sv = new MessageEmbed()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ guild.id +"`\n:label: Server name: `"+ guild.name +"`\n\n:busts_in_silhouette: Members: `"+ qtd_users +"`\n:placard: Channels: `"+ canais +"`")
        .setTimestamp();

    client.channels.cache.get(id_canais[0]).send({ embeds : [embed_sv] });
    
    if(ocasiao !== "Left")
        await require('./idioma.js')({client, guild});
}