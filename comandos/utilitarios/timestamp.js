const fetch = require('node-fetch');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "timestamp",
    description: "converte uma data para timestamp ou vice-versa",
    aliases: [ "time", "stamp" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        let idioma = client.idioma.getLang(message.guild.id);
        idioma == "al-br" ? "pt-br" : idioma;

        const { utilitarios } = require(`../../arquivos/idiomas/${idioma}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);

        const emoji_error = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if (args.length < 1) return message.reply(`${emoji_error} | ${utilitarios[19]["aviso_1"].replaceAll(".a", prefix)}`);

        let timestamp, aviso = "", conversao_invalida = false;
        let titulo = utilitarios[19]["timestamp_1"];
        let data = args[0].raw;

        if(!args[0].raw.includes("-")){ // De timestamp para data normal
            timestamp = new Date(Number(args[0].raw));
            titulo = utilitarios[19]["timestamp_2"];

            timestamp = `${timestamp.getFullYear()}-${("0"+ timestamp.getMonth()).slice(-2)}-${("0"+ timestamp.getDate()).slice(-2)} ${("0"+ timestamp.getHours()).slice(-2)}:${("0"+ timestamp.getMinutes()).slice(-2)}:${("0"+ timestamp.getSeconds()).slice(-2)}`;

            if((timestamp instanceof Date && !isNaN(timestamp)) || timestamp.split("-")[0] == "NaN")
                conversao_invalida = true;
        }else{ // De data normal para timestamp
            if(args.length >= 2)
                data += ` ${args[1].raw}`;
        
            timestamp = new Date(data).getTime() / 1000;

            if(isNaN(timestamp))
                conversao_invalida = true;
        }
        
        if(conversao_invalida){
            titulo = utilitarios[19]["erro_titulo"];
            aviso = utilitarios[19]["erro_conversao"];
            timestamp = utilitarios[19]["valor_nulo"];
        }

        const embed = new MessageEmbed()
            .setTitle(titulo)
            .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
            .setColor(0x29BB8E)
            .setFooter(aviso)
            .setDescription(`\`${data}\` -> \`${timestamp}\``);

        message.reply({embeds: [embed]});
    }
}