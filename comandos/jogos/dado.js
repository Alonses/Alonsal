module.exports = {
    name: "dado",
    description: "Rode um ou vários dados com várias faces",
    aliases: [ "da", "dice", "di" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { jogos } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        let idioma_definido = idioma_servers[message.guild.id];

        let dado = []; 
        let resultado = "";
        let att_auto = 0;

        if(typeof args[0] === "undefined")
            args[0] = 1;

        if(args.length > 0){
            if(isNaN(args[0])){
                message.lineReply(":warning: | "+ jogos[2]["aviso_1"]);
                return;
            }

            if(typeof args[1] !== "undefined")
                if(isNaN(args[1])){
                    message.lineReply(":warning: | "+ jogos[2]["aviso_1"]);
                    return;
                }
            
            if(args[0] > 50){
                message.lineReply(":warning: | "+ jogos[2]["error_1"]);
                return;
            }

            if(args[0] < 1){
                message.lineReply(":warning: | "+ jogos[2]["aviso_2"]);
                return;
            }

            if(typeof args[1] === "undefined"){
                args[1] = 5;
                att_auto = 1;
            }else{
                if(args[1] > 10000){
                    message.lineReply(":warning: | "+ jogos[2]["error_2"]);
                    return;
                }
            
                if(args[1] < 4){
                    message.lineReply(":warning: | "+ jogos[2]["error_3"]);
                    return;
                }
            }

            for(let i = 0; i < args[0]; i++){ // Rodar os dados
                dado.push(1 + Math.round((args[1] - 1) * Math.random()));
            }
        }

        for(let i = 0; i < dado.length; i++){
            resultado += "`"+ dado[i] +"`";

            if(typeof dado[i + 1] != "undefined")
                resultado += ", ";
        }

        if(att_auto == 1)
            args[1]++;
        
        let mensagem = 'Foram rodados `'+ args[0] +'` sólidos geométricos com `'+ args[1] +'` faces\n\n Resultados [ '+ resultado +' ]';

        if(idioma_definido == "en-us")
            mensagem = 'Rotated `'+ args[0] +'` geometric solids with `'+ args[1] +'` faces\n\n Results [ '+ resultado +' ]';
        
        if(args[0] == 1){
            mensagem = 'Foi rodado `1` sólido geométrico com `'+ args[1] +'` faces\n\n Resultado [ '+ resultado +' ]';
        
            if(idioma_definido == "en-us")
                mensagem = 'Run `1` geometric solid with `'+ args[1] +'` faces\n\n Result [ '+ resultado +' ]';
        }

        message.lineReply(":game_die: "+ mensagem);
    }
};