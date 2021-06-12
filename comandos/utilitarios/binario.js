const { MessageEmbed }  = require('discord.js');
const binario = require('./binario.json');

module.exports = async function({message, args}) {

    let texto;
    let ordena = "";
    let tipo_texto = 0;

    if(args.length > 0){
        for(let x = 0; x < args.length; x++){
            ordena += args[x] + " ";
        }

        // Remove o último espaço
        entrada = ordena.slice(0, -1).toLowerCase();
        texto = entrada.split(' ');

        if(Object.keys(binario).find(key => binario[key] === texto[0]))
            tipo_texto = 1;
        
        if(tipo_texto == 0){
            texto = entrada.split('');
            for(let carac = 0; carac < texto.length; carac++){
                if(binario[texto[carac]])
                    texto[carac] = binario[texto[carac]] + " ";
            }
        }else{
            for(let carac = 0; carac < texto.length; carac++){
                if(Object.keys(binario).find(key => binario[key] === texto[carac]))
                    texto[carac] = Object.keys(binario).find(key => binario[key] === texto[carac]);
            }
        }

        // Montando 
        var texto_ordenado = "";
        for(let i = 0; i < texto.length; i++){
            texto_ordenado += texto[i];
        }

        let titulo = ":one: Sua mensagem codificada em binário";

        if(tipo_texto == 1)
            titulo = ":zero: Sua mensagem decodificada do binário";

        const embed = new MessageEmbed()
        .setTitle(titulo)
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
        .setColor(0x29BB8E)
        .setDescription("`" + texto_ordenado + "`");

        message.channel.send(`${message.author}`, embed);
    }else
        message.channel.send("Envie como `.abn texto` para codificar em binário\nou `.abn 11100011` para decodificar do binário.");
}