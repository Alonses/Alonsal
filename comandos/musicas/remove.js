const ytdl = require('ytdl-core');

module.exports = async function({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal}){

    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

    if(typeof playlists !== "undefined"){

        if(args.length !== 2){
            message.lineReply(":octagonal_sign: | "+ musicas[7]["aviso_1"]);
            return;
        }

        let rm_faixa = parseInt(args[1]);
        
        if(isNaN(rm_faixa) && args[1] !== "all"){
            message.lineReply(musicas[7]["aviso_2"]);
            return;
        }

        let queue_local = playlists.get(id_canal);
        let nome_faixas_l = nome_faixas.get(id_canal);

        if(rm_faixa !== 1){
            if(args[1] === "all" && queue_local.length >= 2){
                
                let faixa_atual = queue_local[0];
                let nome_faixa = "";

                if(typeof nome_faixas_l !== "undefined")
                    nome_faixa = nome_faixas_l[0];

                queue_local = [];
                nome_faixas_l = [];

                queue_local.push(faixa_atual);
                
                if(nome_faixa !== "")
                    nome_faixas_l.push(nome_faixa);

                message.lineReply(":wastebasket: | "+ musicas[7]["removido_1"]);
            }else{
                // Removendo a faixa informada do array
                link_removido = queue_local.splice(rm_faixa - 1, 1);
                let faixa_removida;
                 
                if(typeof nome_faixas_l !== "undefined" && nome_faixas_l.length == queue_local.length)
                    faixa_removida = nome_faixas_l.splice(rm_faixa - 1, 1);
                else
                    faixa_removida = await ytdl.getInfo(link_removido).then(info => info.videoDetails.title);

                message.lineReply(":wastebasket: | "+ musicas[7]["removido_2"] +" [ `"+ faixa_removida +"` ] "+ musicas[7]["removido_3"]);
            }
        }else{
            message.lineReply(musicas[7]["aviso_3"]);
            return;
        }

        playlists.set(id_canal, queue_local)
        nome_faixas.set(id_canal, nome_faixas_l)
        
        tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "updt");
    }
}