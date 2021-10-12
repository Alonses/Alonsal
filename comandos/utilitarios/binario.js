module.exports = {
    name: "binario",
    description: "Codifique e decodifique do binário",
    aliases: [ "bn" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

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
            
            if(tipo_texto === 0){
                texto = entrada.split('');
                for(let carac = 0; carac < texto.length; carac++){
                    texto[carac] = texto[carac].charCodeAt().toString(2);

                    if(texto[carac + 1] !== undefined)
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
                
                if(reverso && tipo_texto === 0 && i === 0)
                    texto_ordenado += " ";
            }
            
            let titulo = utilitarios[3]["codificado"];

            if(tipo_texto === 1)
                titulo = utilitarios[3]["decodificado"];

            const embed = new MessageEmbed()
            .setTitle(titulo)
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
            .setColor(0x29BB8E)
            .setDescription("`" + texto_ordenado + "`");

            message.reply({ embeds: [embed] })
            .catch(() => {
                message.reply(":octagonal_sign: | "+ utilitarios[3]["error_1"]).then(message => message.delete({ timeout: 5000 }));
            });
        }else
            return message.reply(utilitarios[3]["aviso"]);
    },
};