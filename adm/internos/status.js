const { version } = require('../../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = async ({client}) => {

    if(client.user.id === "833349943539531806"){

        const canais_texto = client.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        const canais_voz = client.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        let members = 0;

        client.guilds.cache.forEach(async guild => {
            members += guild.memberCount - 1;
        });

        const embed = new MessageEmbed()
        .setTitle(':steam_locomotive: Caldeiras aquecidas')
        .setColor(0x29BB8E)
        .addFields(
            {
                name: ':globe_with_meridians: **Servidores**', 
                value: `**Ativo em: **\`${client.guilds.cache.size}\``, 
                inline: true 
            },
            {
                name: ':card_box: **Canais**', 
                value: `**Observando: **\`${canais_texto}\`\n**Falando em: ** \`${canais_voz}\``, 
                inline: true 
            },
            {
                name: ':busts_in_silhouette: **Usuários**', 
                value: `**Escutando: **\`${members}\``, 
                inline: true 
            }
        )
        .addField(':white_small_square: Versão', `\`${version}\``, false)
        .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");
        
        client.channels.cache.get('854695578372800552').send({ embeds: [embed] }); // Avisa que está online em um canal
        
        client.user.setActivity('Faites chauffer la vapeur!', 'COMPETING')
        const activities = [
            "Rank 500x!!!",
            ".alang | French now!",
            `Hosts pelo ar`,
            "pinga azul em sapos",
            "Ping me for prefix!",
            ".alang | French now!",
            "Rank 500x!!!",
            "Bonjour la France!",
            "cocô pela janela",
        ];

        let i = 0;
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 10000);
    }else
        client.user.setPresence({ activities: [{ name: 'baidu nos servidores' }] });

    require('./relata.js')({client});
}