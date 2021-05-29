const Discord = require('discord.js');
const binario = require('./binario.json');

module.exports = async function({message, args}) {

    var ordena = "";
    tipo_texto = 0;

    if(args.length > 0){
        for(var x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
        var texto = entrada.split(' ');

        if(Object.keys(binario).find(key => binario[key] === texto[0]))
            tipo_texto = 1;
        
        if(tipo_texto == 0){
            var texto = entrada.split('');
            for(var carac = 0; carac < texto.length; carac++){
                if(binario[texto[carac]])
                    texto[carac] = binario[texto[carac]] + " ";
            }
        }else{
            for(var carac = 0; carac < texto.length; carac++){
                if(Object.keys(binario).find(key => binario[key] === texto[carac]))
                    texto[carac] = Object.keys(binario).find(key => binario[key] === texto[carac]);
            }
        }

        // Montando 
        var texto_ordenado = "";
        for(var i = 0; i < texto.length; i++){
            texto_ordenado += texto[i];
        }
        
        var titulo = ":one: Sua mensagem codificada em binário";

        if(tipo_texto == 1)
            titulo = ":zero: Sua mensagem decodificada do binário";

            const m = await message.channel.send(`${message.author}`);

            const embed = new Discord.MessageEmbed()
            .setTitle(titulo)
            .setAuthor(message.author.username)
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            m.edit(embed);
    }else
        message.channel.send("Envie como `ãbn texto` para codificar em binário\nou `ãbn 11100011` para decodificar do binário.");
}
