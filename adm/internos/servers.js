const { EmbedBuilder } = require('discord.js')

module.exports = async ({client, caso, guild}) => {

    // if(client.user.id !== "833349943539531806") return

    let ocasiao = "> 🟢 Server update"
    let cor = 0x29BB8E
    let canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size
    
    if(caso === "Left"){
        ocasiao = "> 🔴 Server update"
        cor = 0xd4130d
    }

    const embed_sv = new EmbedBuilder()
        .setTitle(ocasiao)
        .setColor(cor)
        .setDescription(`:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )\n\n:busts_in_silhouette: Members ( \`${guild.memberCount - 1}\` )\n:placard: Channels ( \`${canais}\` )`)
        .setTimestamp()

    client.channels.cache.get('846853254192693269').send({ embeds : [embed_sv] })
}