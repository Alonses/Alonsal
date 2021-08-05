const { id_canais, version } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = async ({client}) => {

    const embed = new MessageEmbed()
    .setTitle(':steam_locomotive: Caldeiras aquecidas')
    .setColor(0x29BB8E)
    .addFields(
        { name: ':globe_with_meridians: **Servidores**', value: "**Ativo em: **`"+ client.guilds.cache.size +"`", inline: true },
        { name: ':card_box: **Canais**', value: "**Observando: **`"+ client.channels.cache.size +"`", inline: true },
        { name: ':busts_in_silhouette: **Usuários**', value: "**Conhecidos: **`"+ client.users.cache.size +"`", inline: true },
    )
    .addField(':white_small_square: Versão', '`'+ version +'`', false)
    .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");
    
    if(client.user.id !== "846472827212136498")
        client.channels.cache.get(id_canais[2]).send(embed); // Avisa que está online em um canal

    client.user.setActivity('Vapor p/ fora!', 'COMPETING')
    const activities = [
        ".ah | .ajuda",
        "Binário na fogueira",
        "Mesas p/ cima",
        "Baidu premium em servidores",
        ".ah | .ajuda",
        "Imagens em preto e branco",
        "Bugs infinitos no sistema",
        "Vapor p/ fora!"
    ];

    let i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 6000);
}