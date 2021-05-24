const Discord = require('discord.js');

var caracteres = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", ",", "?", "'", "!", "/", "(", ")", "&", ":", ";", "=", "-", "_", "$", "@", "ä", "æ", "à", "å", "ç", "ĉ", "ü", "ŭ", "+", "ã", "é", "ê", "á", "ó", "ô", "¿", "¡", "<", ">", "~", "\\", "í", "ï"];
var binario = ["01100001", "01100010", "01100011", "01100100", "01100101", "01100110", "01100111", "01101000", "01101001", "01101010", "01101011", "01101100", "01101101", "01101110", "01101111", "01110000", "01110001", "01110010", "01110011", "01110100", "01110101", "01110110", "01110111", "01111000", "01111001", "01111010", "00110001", "00110010", "00110011", "00110100", "00110101", "00110110", "00110111", "00111000", "00111001", "00110000", "00101110", "00101100", "00111111", "00100111", "00100001", "00101111", "00101000", "00101001", "00100110", "00111010", "00111011", "00111101", "00101101", "01011111", "00100100", "01000000", "11100100", "11100110", "11100000", "11100101", "11100111", "00111111", "11111100", "00111111", "00101011", "11100011", "11101001", "11101010", "11100001", "11110011", "11110100", "10111111", "10100001", "00111100", "00111110", "01111110", "01011100", "11101101", "11101111"];

module.exports = async function({message, args}) {

    var ordena = "";
    tipo_texto = 0;

    if(args.length > 0){
        for(var x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
        
        for(var x = 0; x < binario.length; x++){
            if(entrada.includes(binario[x])){
                tipo_texto = 1;
            }
        }

        if(tipo_texto == 0){
            var texto = entrada.split('');

            for(var carac = 0; carac < texto.length; carac++){
                for(var i = 0; i < caracteres.length; i++){
                    if(texto[carac] == " "){
                        texto[carac] = "00100000 ";
                        break;
                    }if(texto[carac] == caracteres[i]){
                        texto[carac] = binario[i] + " ";
                        break;
                    }
                }
            }
        }else{
            var texto = entrada.split(' ');

            for(var carac = 0; carac < texto.length; carac++){
                for(var i = 0; i < binario.length; i++){
                    if(texto[carac] == "00100000"){
                        texto[carac] = " ";
                        break;
                    }if(texto[carac] == binario[i]){
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
            var titulo = "Sua mensagem codificada em binário";
        else
            var titulo = "Sua mensagem decodificada do binário";

            const m = await message.channel.send(`${message.author}`);

            const embed = new Discord.MessageEmbed()
            .setTitle(titulo)
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            m.edit(embed);
    }else
        message.channel.send("Envie como `ãb texto` para codificar em binário\nou `ãb 11100011` para decodificar do binário.");
}