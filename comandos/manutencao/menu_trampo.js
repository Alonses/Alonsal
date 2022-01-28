const { MessageEmbed } = require('discord.js');

module.exports = ({client, message}) => {

    const idioma_adotado = client.idioma.getLang(message.guild.id);
    const prefix = client.prefixManager.getPrefix(message.guild.id);
    let embed;

    if(idioma_adotado === "pt-br"){
        embed = new MessageEmbed()
        .setTitle("Comandos de trabilson :satellite:")
        .setColor(0xfffb29)
        .setDescription(`:fax: **\`.abp 08:07\`** - Registra um ponto\n:pencil: **\`.abp 1 20:07\`** - Edita um ponto\n:beers: **\`.atr\`** | **\`.awr\`** - O Resumo do seu dia\n:date: **\`.abp 25/01/2022 1 08:07\`** - Cria/Edita seu ponto em outro dia`.replaceAll(".a", prefix))
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
    }else{
        embed = new MessageEmbed()
        .setTitle("Work commands :satellite:")
        .setColor(0xfffb29)
        .setDescription(`:fax: **\`.abp 08:07\`** - Register a point\n:pencil: **\`.abp 1 20:07\`** - Edit a point\n:beers: **\`.atr\`** | **\`.awr\`** - The summary of your day\n:date: **\`.abp 25/01/2022 1 08:07\`** - Create/Edit your point another day`.replaceAll(".a", prefix))
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
    }

    message.reply({ embeds: [embed] });
}