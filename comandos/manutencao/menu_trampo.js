const { MessageEmbed } = require('discord.js');

module.exports = ({client, message}) => {

    const idioma_adotado = client.idioma.getLang(message.guild.id);
    const prefix = client.prefixManager.getPrefix(message.guild.id);
    let embed;

    if(idioma_adotado === "pt-br"){
        embed = new MessageEmbed()
        .setTitle("Assistente de trabalho :satellite:")
        .setColor(0xfaa81a)
        .setDescription(`:fax: **\`${prefix}bp 08:07\`** - Registra um ponto\n:pencil: **\`${prefix}bp 1 20:07\`** - Edita um ponto\n:beers: **\`${prefix}tr\`** | **\`${prefix}wr\`** - O Resumo do seu dia\n:wine_glass: **\`${prefix}tr 21/01/2022\`** - O Resumo em um dia diferente\n:date: **\`${prefix}bp 21/01/2022 1 08:07\`** - Cria/Edita seu ponto em outro dia`)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
    }else{
        embed = new MessageEmbed()
        .setTitle("Work assistant :satellite:")
        .setColor(0xfaa81a)
        .setDescription(`:fax: **\`${prefix}bp 08:07\`** - Register a point\n:pencil: **\`${prefix}bp 1 20:07\`** - Edit a point\n:beers: **\`${prefix}tr\`** | **\`${prefix}wr\`** - The summary of your day\n:wine_glass: **\`${prefix}tr 21/01/2022\`** - The Summary on a different day\n:date: **\`${prefix}bp 21/01/2022 1 08:07\`** - Create/Edit your point another day`)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
    }

    message.reply({ embeds: [embed] });
}