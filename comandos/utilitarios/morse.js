const Discord = require('discord.js');
const morse = require('./morse.json');

module.exports = async function({message, args}) {

    var ordena = "";
    var aviso = "";
    tipo_texto = 0;

    if(args.length > 0){
        for(var x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
    
        var texto = entrada.split(' ');

        if(Object.keys(morse).find(key => morse[key] === texto[0]))
            tipo_texto = 1;
        
        if(tipo_texto == 0){
            var texto = entrada.split('');
            for(var carac = 0; carac < texto.length; carac++){
                if(morse[texto[carac]])
                    texto[carac] = morse[texto[carac]] + " ";
                else{
                    texto[carac] = "";
                    aviso = "Alguns caracteres não foram codificados pois não existem no morse";
                }
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
        
        if(texto_ordenado.length == 0){
            texto_ordenado = "Caracteres inválidos";
            titulo = ":warning: Houve um problema ao codificar";
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(titulo)
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
        .setColor(0x29BB8E)
        .setFooter(aviso)
        .setDescription("`" + texto_ordenado + "`");

        message.channel.send(`${message.author}`, embed);
    }else
        message.channel.send("Envie como `.am texto` para codificar em morse\nou `.am .- .-.. --- -. ... .- .-..` para decodificar do morse.");
}