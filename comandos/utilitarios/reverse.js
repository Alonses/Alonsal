module.exports = {
    name: "reverso",
    description: "Inverta ou desinverta caracteres",
    aliases: [ "rev", "inverso", "reverter" ],
    usage: "rev Alonsal",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');

        if(args.length != 0){
            ordena = "";

            for(var x = 0; x < args.length; x++){
                ordena += args[x] + " ";
            }

            ordena = ordena.slice(0, -1).toLowerCase();

            texto = ordena.split('');
            texto = texto.reverse();

            var texto_ordenado = "";
            for(var i = 0; i < texto.length; i++){
                texto_ordenado += texto[i];
            }

            const embed = new MessageEmbed()
                .setTitle(':arrow_backward: Sua mensagem ao contrário')
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
                .setColor(0x29BB8E)
                .setDescription("`" + texto_ordenado + "`");

            message.channel.send(`${message.author}`, embed);
        }
    }
};