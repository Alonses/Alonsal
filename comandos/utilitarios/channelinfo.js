const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');
 
module.exports = {
    name: "channelinfo",
    description: "Veja detalhes de algum canal",
    aliases: [ "chinfo", "cinfo" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        let nsfw = utilitarios[9]["nao"];
        if(message.channel.nsfw)
            nsfw = utilitarios[9]["sim"];

        let infos_ch = new MessageEmbed()
        .setTitle(message.channel.name)
        .setColor(0x29BB8E)
        .addFields(
            { name: ':globe_with_meridians: **'+ utilitarios[15]["id_canal"] +'**', value: "`"+ message.channel.id +"`", inline: true },
            { name: ':earth_americas: **'+ utilitarios[15]["idioma"] +'**', value: "`"+ message.guild.preferredLocale +"` :flag_"+ message.guild.preferredLocale.toLocaleLowerCase().slice(3, 7) +":", inline: true },
            { name: ':underage: NSFW', value: `\`${nsfw}\``, inline: true}
        )
        .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));
        
        return message.reply({embeds: [infos_ch]});
    }
}