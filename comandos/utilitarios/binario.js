module.exports = {
    name: "binario",
    description: "Codifique e decodifique do binário",
    aliases: [ "bn" ],
    usage: "bn texto",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const binario = require('../../arquivos/json/text/binario.json');
        
        let texto;
        let ordena = "";
        let tipo_texto = 0;
        let reverso = false;

        if(args.length > 0){
            for(let x = 0; x < args.length; x++){
                ordena += args[x] + " ";
            }

            if(ordena.indexOf("rev") !== -1){
                ordena = ordena.replace("rev ", "");
                reverso = true;
            }

            // Remove o último espaço
            entrada = ordena.slice(0, -1).toLowerCase();
            texto = entrada.split(' ');

            if(Object.keys(binario).find(key => binario[key] === texto[0]))
                tipo_texto = 1;
            
            if(tipo_texto == 0){
                texto = entrada.split('');
                for(let carac = 0; carac < texto.length; carac++){
                    texto[carac] = "0"+ texto[carac].charCodeAt().toString(2);

                    if(texto[carac + 1] != undefined)
                        texto[carac] += " ";
                }
            }else{
                for(let carac = 0; carac < texto.length; carac++){
                    if(Object.keys(binario).find(key => binario[key] === texto[carac]))
                        texto[carac] = Object.keys(binario).find(key => binario[key] === texto[carac]);
                }
            }

            if(reverso) // Inverte os caracteres
                texto = texto.reverse();

            // Montando 
            var texto_ordenado = "";
            for(let i = 0; i < texto.length; i++){

                texto_ordenado += texto[i];
                
                if(reverso && tipo_texto == 0 && i == 0)
                    texto_ordenado += " ";
            }
            
            let titulo = ":one: Sua mensagem codificada em binário";

            if(tipo_texto == 1)
                titulo = ":zero: Sua mensagem decodificada do binário";

            const embed = new MessageEmbed()
            .setTitle(titulo)
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            message.lineReply(embed);
        }
    },
};