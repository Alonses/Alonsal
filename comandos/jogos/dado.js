module.exports = {
    name: "dado",
    description: "Rode um ou vários dados com várias faces",
    aliases: [ "da", "dice", "di" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const idioma_definido = client.idioma.getLang(message.guild.id);
        const { jogos } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        let dado = []; 
        let resultado = "";
        let att_auto = 0;

        if(typeof args[0] === "undefined")
            args[0] = 1;

        if(args.length > 0){
            if(isNaN(args[0])) // Caracteres de texto
                return message.reply(":warning: | "+ jogos[2]["aviso_1"]);
            
            if(typeof args[1] !== "undefined")
                if(isNaN(args[1])) // Caracteres de texto
                    return message.reply(":warning: | "+ jogos[2]["aviso_1"]);
                  
            if(args[0] > 50) // Mais que 50 dados
                return message.reply(":warning: | "+ jogos[2]["error_1"]);

            if(args[0] < 1) // Menos que 0 dados
                return message.reply(":warning: | "+ jogos[2]["aviso_2"].replaceAll(".a", prefix));

            if(typeof args[1] === "undefined"){
                args[1] = 5;
                att_auto = 1;
            }else{
                if(args[1] > 10000) // Mais que 10.000 faces
                    return message.reply(":warning: | "+ jogos[2]["error_2"]);
                
                if(args[1] < 4) // Menos que 4 faces
                    return message.reply(":warning: | "+ jogos[2]["error_3"]);
            }

            for(let i = 0; i < args[0]; i++){ // Rodar os dados
                dado.push(1 + Math.round((args[1] - 1) * Math.random()));
            }
        }

        for(let i = 0; i < dado.length; i++){
            resultado += "`"+ dado[i].toLocaleString('pt-BR') +"`";

            if(typeof dado[i + 1] != "undefined")
                resultado += ", ";
        }

        if(att_auto === 1)
            args[1]++;
        
        let mensagem = 'Foram rodados `'+ args[0] +'` sólidos geométricos com `'+ parseInt(args[1]).toLocaleString('pt-BR') +'` faces\n\n Resultados [ '+ resultado +' ]';

        if(idioma_definido === "en-us")
            mensagem = 'Rotated `'+ args[0] +'` geometric solids with `'+ parseInt(args[1]).toLocaleString('pt-BR') +'` faces\n\n Results [ '+ resultado +' ]';
        
        if(args[0] === 1){
            mensagem = 'Foi rodado `1` sólido geométrico com `'+ parseInt(args[1]).toLocaleString('pt-BR') +'` faces\n\n Resultado [ '+ resultado +' ]';
        
            if(idioma_definido === "en-us")
                mensagem = 'Run `1` geometric solid with `'+ parseInt(args[1]).toLocaleString('pt-BR') +'` faces\n\n Result [ '+ resultado +' ]';
        }

        message.reply(":game_die: "+ mensagem);
    }
};