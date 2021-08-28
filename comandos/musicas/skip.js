module.exports = async function({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal}){

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
                    message.channel.send(`${message.author} informe o número de uma faixa para poder pular`);
                    return;
                }

                if(pular_para == 1){
                    message.channel.send(`${message.author} não tem como pular para a faixa atual :v`);
                    return;
                }

                message.channel.send(":fast_forward: Pulando para a `"+ pular_para +"°` faixa");

                if(pular_para <= queue_local.length){
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
                    message.lineReply(":interrobang: | O número informado é maior que a playlist atual");
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
                message.channel.send(":fast_forward: Pulando para a próxima faixa");
            
            if(queue_local.length > 0){
                atividade_bot.set(id_canal, 0);
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa);
            }else if(repeteco.get(id_canal) !== 1){
                atividade_bot.set(id_canal, 0);
                
                message.channel.send(":free: Playlist finalizada!");
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
            }
            
            return;
        }else{
            if(queue_local.length > 0){
                message.channel.send(":track_next: Pulando todas as faixas");

                await playlists.set(id_canal, []);
                await nome_faixas.set(id_canal, []);
                await repeteco.set(id_canal, 0);
                await atividade_bot.set(id_canal, 0);
                
                // console.log("playlists: "+ playlists);
                
                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
                return;
            }
        }
    }else if(message.content === ".assk"){
        message.channel.send("Inicie alguma música com `.as url` ou `.asra` para poder pular.");
        return;
    }
}