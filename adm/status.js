const { id_canais, version } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = async ({client}) => {
    
    const canais_texto = client.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
    const canais_voz = client.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
    let members = 0;

    client.guilds.cache.forEach(async guild => {
        members += guild.memberCount - 1;
    });

    if(client.user.id === "833349943539531806"){
        const embed = new MessageEmbed()
        .setTitle(':steam_locomotive: Caldeiras aquecidas')
        .setColor(0x29BB8E)
        .addFields(
            { name: ':globe_with_meridians: **Servidores**', value: "**Ativo em: **`"+ client.guilds.cache.size +"`", inline: true },
            { name: ':card_box: **Canais**', value: "**Observando: **`"+ canais_texto +"`\n**Falando em: ** `"+ canais_voz +"`", inline: true },
            { name: ':busts_in_silhouette: **Usuários**', value: "**Escutando: **`"+ members +"`", inline: true },
        )
        .addField(':white_small_square: Versão', '`'+ version +'`', false)
        .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");
        
        client.channels.cache.get(id_canais[2]).send({ embeds: [embed] }); // Avisa que está online em um canal
    }

    client.user.setActivity('Vapor p/ fora!', 'COMPETING')
    const activities = [
        "Me pingue para o prefixo!",
        "Bugs fora",
        ".alang pt | .alang en",
        "Seria ceira ceira seria?",
        "Ping me for prefix!",
        "Translation worldwide",
    ];

    let i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 10000);
}