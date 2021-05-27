const Discord = require('discord.js');

var caracteres = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", ",", "?", "'", "!", "/", "(", ")", "&", ":", ";", "=", "-", "_", "$", "@", "ä", "æ", "à", "å", "ç", "ĉ", "ü", "ŭ", "+", "ã", "é", "ê", "á", "ó", "ô", "¿", "¡"];
var morse = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----", ".-.-.-", "--..--", "..--..", ".----.", "-.-.--", "-..-.", "-.--.", "-.--.-", ".-...", "---...", "-.-.-.", "-...-", "-....-", "..--.-", "...-..-", ".--.-.", ".-.-", ".-.-", ".--.-", ".--.-", "-.-...", "-.-...", "..---", "..---", ".-.-.", ".--.-", "..-..", "-..-.", ".--.-", "---.", "---.", "..-.-", "--...-"];

module.exports = async function({message, args}) {

    var ordena = "";
    tipo_texto = 0;

    if(args.length > 0){
        for(var x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
    
        for(var x = 0; x < morse.length; x++){
            if(entrada.includes(morse[x])){
                tipo_texto = 1;
            }
        }

        while(entrada.includes("<") || entrada.includes(">")){
            entrada = entrada.replace("<", "");
            entrada = entrada.replace(">", "");
        }

        if(tipo_texto == 0){
            var texto = entrada.split('');

            for(var carac = 0; carac < texto.length; carac++){
                for(var i = 0; i < caracteres.length; i++){
                    if(texto[carac] == " "){
                        texto[carac] = "/ ";
                        break;
                    }if(texto[carac] == caracteres[i]){
                        texto[carac] = morse[i] + " ";
                        break;
                    }
                }
            }
        }else{
            var texto = entrada.split(' ');

            for(var carac = 0; carac < texto.length; carac++){
                for(var i = 0; i < morse.length; i++){
                    if(texto[carac] == "/"){
                        texto[carac] = " ";
                        break;
                    }if(texto[carac] == morse[i]){
                        texto[carac] = caracteres[i];
                        break;
                    }
                }
            }
        }

        // Montando 
        var texto_ordenado = "";
        for(var i = 0; i < texto.length; i++){
            texto_ordenado += texto[i];
        }
        
        if(tipo_texto == 0)
            var titulo = "Sua mensagem codificada em morse";
        else
            var titulo = "Sua mensagem decodificada do morse";

            const m = await message.channel.send(`${message.author}`);

            const embed = new Discord.MessageEmbed()
            .setTitle(titulo)
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            m.edit(embed);
    }else
        message.channel.send("Envie como `ãm texto` para codificar em morse\nou `ãm .- .-.. --- -. ... .- .-..` para decodificar do morse.");
}