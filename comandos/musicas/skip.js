module.exports = async function({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal}){

    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    const idioma_selecionado = idioma_servers[message.guild.id];

    queue_local = playlists.get(id_canal);
    queue_faixas = nome_faixas.get(id_canal);

    if(typeof queue_faixas === "undefined")
        queue_faixas = [];

    let pular_para;

    if(queue_local.length > 0){
        if(args[1] !== "all"){

            if(typeof args[1] !== "undefined"){
                pular_para = parseInt(args[1]);
                
                if(isNaN(pular_para)){
                    message.channel.send(`${message.author} `+ musicas[5]["aviso_1"]);
                    return;
                }

                if(pular_para == 1){
                    message.channel.send(`${message.author} `+ musicas[5]["aviso_2"]);
                    return;
                }

                if(pular_para <= queue_local.length){

                    if(idioma_selecionado == "pt-br")
                        message.channel.send(":fast_forward: Pulando para a `"+ pular_para +"°` faixa");
                    else
                        message.channel.send(":fast_forward: Skipping to `"+ pular_para +"°` track");

                    for(var i = 1; i < pular_para; i++){

                        var faixa_atual = queue_local[0];
                        var nome_faixa = queue_faixas[0];

                        queue_local.shift();
                        queue_faixas.shift();

                        // Insere novamente as faixas na playlist em caso de skip com a repetição ativa
                        if(repeteco.get(id_canal) === 1 && !queue_local.includes(faixa_atual) && i !== pular_para - 1){
                            queue_local.push(faixa_atual);
                            queue_faixas.push(nome_faixa);
                        }
                    }
                }else{
                    message.lineReply(":interrobang: | "+ musicas[5]["error_1"]);
                    return;
                }
            }else{
                var faixa_atual = queue_local[0];
                var nome_faixa = queue_faixas[0];

                queue_local.shift();
                queue_faixas.shift();
            }

            if(repeteco.get(id_canal) === 1){
                queue_local.push(faixa_atual);
                queue_faixas.push(nome_faixa);
            }

            if(queue_local.length > 0 && typeof pular_para !== "number")
                message.channel.send(":fast_forward: "+ musicas[5]["pulando_1"]);
            
            if(queue_local.length > 0){
                atividade_bot.set(id_canal, 0);
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa);
            }else if(repeteco.get(id_canal) !== 1){
                atividade_bot.set(id_canal, 0);
                
                message.channel.send(musicas[5]["playlist"]);
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
            }
            
            return;
        }else{
            if(queue_local.length > 0){
                message.channel.send(":track_next: "+ musicas[5]["pulando_2"]);

                await playlists.set(id_canal, []);
                await nome_faixas.set(id_canal, []);
                await repeteco.set(id_canal, 0);
                await atividade_bot.set(id_canal, 0);
                                
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
                return;
            }
        }
    }else if(message.content === ".assk"){
        message.channel.send(musicas[5]["aviso_3"]);
        return;
    }
}