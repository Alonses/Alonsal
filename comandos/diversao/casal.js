module.exports = {
    name: "casal",
    description: "Teste o nível de afeto entre duas pessoas",
    aliases: [ "mor", "love" ],
    usage: "mor <@><@>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { diversao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const { MessageEmbed } = require('discord.js');

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        
        if(args[1] === "" && args[2].includes("<@"))
            args.splice(1, 1);

        if(args.length != 2 || !args[0].includes("<@") || !args[1].includes("<@"))
            return message.lineReply(diversao[2]["aviso_1"].replaceAll(".a", prefix));
        
        let titulo = diversao[2]["limda"];
        let num = 100;
        let porcentagem = "";
        let aviso = diversao[2]["rodape"];

        if(args[0] !== args[1]){
            num = Math.round(Math.random() * 100);
            aviso = "";
        }

        if(args[0] !== args[1]){
            if(num == 100)
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
        }

        if(args[0] === args[1])
            porcentagem = ":sparkling_heart: ";
        else
            porcentagem = args[0] +" e "+ args[1] + "\n\n";

        for(let i = 0; i <= num - 10; i = i + 10){
            porcentagem += ":sparkling_heart: ";
        }

        for(let i = num; i < 100; i = i + 10){
            porcentagem += ":black_heart: ";
        }

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(titulo)
        .setDescription( diversao[2]["teste"] +` ${num}%!\n${porcentagem}\n\n${aviso}`)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp();

        message.lineReply(`${message.author}`, embed);
    }
};