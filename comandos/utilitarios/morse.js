const Discord = require('discord.js');
const morse = require('./morse.json');

module.exports = async function({message, args}) {

    var ordena = "";
    tipo_texto = 0;

    if(args.length > 0){
        for(var x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
    
        while(entrada.includes("<") || entrada.includes(">")){
            entrada = entrada.replace("<", "");
            entrada = entrada.replace(">", "");
        }

        var texto = entrada.split(' ');

        if(Object.keys(morse).find(key => morse[key] === texto[0]))
            tipo_texto = 1;
        
        if(tipo_texto == 0){
            var texto = entrada.split('');
            for(var carac = 0; carac < texto.length; carac++){
                if(morse[texto[carac]])
                    texto[carac] = morse[texto[carac]] + " ";
            }
        }else{
            for(var carac = 0; carac < texto.length; carac++){
                if(Object.keys(morse).find(key => morse[key] === texto[carac]))
                    texto[carac] = Object.keys(morse).find(key => morse[key] === texto[carac]);
            }
        }

        // Montando 
        var texto_ordenado = "";
        for(var i = 0; i < texto.length; i++){
            texto_ordenado += texto[i];
        }
        
        var titulo = ":symbols: Sua mensagem codificada em morse";

        if(tipo_texto == 1)
            titulo = ":symbols: Sua mensagem decodificada do morse";

            const m = await message.channel.send(`${message.author}`);

            const embed = new Discord.MessageEmbed()
            .setTitle(titulo)
            .setAuthor(message.author.username)
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            m.edit(embed);
    }else
        message.channel.send("Envie como `ãm texto` para codificar em morse\nou `ãm .- .-.. --- -. ... .- .-..` para decodificar do morse.");
}