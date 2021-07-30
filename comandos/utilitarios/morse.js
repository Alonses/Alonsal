module.exports = {
    name: "morse",
    description: "Codifique e decodifique do morse",
    aliases: [ "m" ],
    usage: "m Alonsal",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { MessageEmbed } = require('discord.js');
        const morse = require('../../arquivos/json/text/morse.json');

        let ordena = "";
        let aviso = "";
        let tipo_texto = 0;

        let entrada;
        if (args.length > 0) {
            for (let x = 0; x < args.length; x++) {
                ordena += args[x] + " ";
            }

            // Remove o último espaço
            entrada = ordena.slice(0, -1).toLowerCase();

            let texto = entrada.split(' ');

            if (Object.keys(morse).find(key => morse[key] === texto[0]))
                tipo_texto = 1;

            if (tipo_texto == 0) {
                texto = entrada.split('');
                for (let carac = 0; carac < texto.length; carac++) {
                    if (morse[texto[carac]])
                        texto[carac] = morse[texto[carac]] + " ";
                    else {
                        texto[carac] = "";
                        aviso = "Alguns caracteres não foram codificados pois não existem no morse";
                    }
                }
            } else {
                for (let carac = 0; carac < texto.length; carac++) {
                    if (Object.keys(morse).find(key => morse[key] === texto[carac]))
                        texto[carac] = Object.keys(morse).find(key => morse[key] === texto[carac]);
                }
            }

            // Montando 
            let texto_ordenado = "";
            for (let i = 0; i < texto.length; i++) {
                texto_ordenado += texto[i];
            }

            let titulo = ":symbols: Sua mensagem codificada em morse";

            if (tipo_texto == 1)
                titulo = ":symbols: Sua mensagem decodificada do morse";

            if (texto_ordenado.length == 0) {
                texto_ordenado = "Caracteres inválidos";
                titulo = ":warning: Houve um problema ao codificar";
            }

            const embed = new MessageEmbed()
                .setTitle(titulo)
                .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
                .setColor(0x29BB8E)
                .setFooter(aviso)
                .setDescription("`" + texto_ordenado + "`");

            message.lineReply(`${message.author}`, embed);
        }
    }
};