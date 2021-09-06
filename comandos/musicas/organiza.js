module.exports = async function({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal}){

    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

    repeteco_ = repeteco.get(id_canal);
    feedback = feedback_faixa.get(id_canal);
    queue_local = playlists.get(id_canal);


    if(message.content == ".asrs"){
        
        await playlists.set(id_canal, []);
        await nome_faixas.set(id_canal, []);
        await repeteco.set(id_canal, 0);
        await atividade_bot.set(id_canal, 0);

        tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
        message.lineReply(":recycle: | "+ musicas[6]["reiniciando"]);
        return;
    }
    
    if(message.content === ".asrp"){

        if(typeof queue_local == "undefined")
            queue_local = [];

        if(repeteco_ === 0){
            await repeteco.set(id_canal, 1);
            message.lineReply(":repeat: "+ musicas[6]["repeteco_1"]);

            if(queue_local.length < 6 && queue_local.length != 0)
                message.lineReply(musicas[6]["playlist_pequena"]);
            else if(queue_local.length == 0)
                message.lineReply(musicas[6]["sem_faixas"]);
            else
                message.lineReply(musicas[6]["anuncio_faixas"]);
        }else{
            await repeteco.set(id_canal, 0);
            message.lineReply(":arrow_forward: "+ musicas[6]["repeteco_2"]);
        }
        
        return;
    }

    if(message.content === ".asfd"){
        msg = ":loudspeaker: "+ musicas[6]["anuncios_1"];

        if(feedback === 0)
            await feedback_faixa.set(id_canal, 1);
        else{
            await feedback_faixa.set(id_canal, 0);
            msg = musicas[6]["anuncios_2"];
        }
        
        tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "updt");

        message.lineReply(msg);
        return;
    }
}