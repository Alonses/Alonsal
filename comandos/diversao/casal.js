const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "casal",
    description: "Teste o nível de afeto entre duas pessoas",
    aliases: [ "mor", "love" ],
    usage: "mor <member> <member>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const member1 = args[0].raw, member2 = args[1].raw;

        let titulo = diversao[2]["limda"];
        let num = 100;
        let porcentagem = "";
        let aviso = diversao[2]["rodape"];

        if(member1.id !== member2.id){
            num = Math.round(Math.random() * 100);
            aviso = "";

            if(num === 100)
                titulo = diversao[2]["100perc"];
            else if(num > 90)
                titulo = diversao[2]["90perc"];
            else if(num > 80)
                titulo = diversao[2]["80perc"];
            else if(num > 60)
                titulo = diversao[2]["60perc"];
            else if(num > 40)
                titulo = diversao[2]["40perc"];
            else if(num > 20)
                titulo = diversao[2]["20perc"];
            else
                titulo = diversao[2]["0perc"];
            
            porcentagem = `${args[0].raw} e ${args[1].raw}\n\n`;
        }

        for(let i = 0; i <= num - 10; i += 10){
            porcentagem += ":sparkling_heart: ";
        }

        for(let i = num; i < 100; i = i + 10){
            porcentagem += ":black_heart: ";
        }

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(titulo)
        .setDescription(`${diversao[2]["teste"]} ${num}%!\n${porcentagem}\n\n${aviso}`)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};