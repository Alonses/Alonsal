const faixas = require('./faixas.json');
const tocar = require('./tocar.js')

module.exports = async function({client, message, args, playlists, nome_faixas, atividade_bot, feedback_faixa, id_canal}){

    queue_local = playlists.get(id_canal)
    _ativo = atividade_bot.get(id_canal)

    if(typeof queue_local == "undefined")
        queue_local = []

    if(typeof _ativo == "undefined")
        _ativo = 0
    
    if(args[0] == "ms" || args[0] == "me" || args[0] == "jg"){
        
        var faixa = 0;
        var contador = 0;
        var faixas_selecionadas = 0;
        alvo = "musicas"
        num_caso = 111

        if(args[0] == "me"){
            alvo = "memes"
            num_caso = 38
        }
        
        if(args[0] == "jg"){
            alvo = "trilhas"
            num_caso = 29
        }

        if(typeof args[1] != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
            faixas_selecionadas = parseInt(args[1]);
            
            if(faixas_selecionadas > 10){
                if(args[0] == "ms")
                    message.channel.send(`${message.author} posso escolher até 10 músicas aleatórias por vez, informe um número menor :P`);
                else if(args[0] == "me")
                    message.channel.send(`${message.author} posso escolher até 10 músicas de memes aleatórias por vez, informe um número menor :P`);
                else
                    message.channel.send(`${message.author} posso escolher até 10 trilhas sonoras aleatórias por vez, informe um número menor :P`);
                
                return;
            }

            if(queue_local.length >= 20){
                message.channel.send(`:minidisc: ${message.author} Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P`);
                return;
            }
        }

        if(typeof args[1] == "undefined")
            if(args[0] == "ms")
                message.channel.send("Escolhendo uma música aleatória");
            else if(args[0] == "me")
                message.channel.send("Escolhendo uma zueira aleatória");
            else
                message.channel.send("Escolhendo uma trilha sonora aleatória");

        do{
            faixa = 1 + Math.round(num_caso * Math.random())
            
            faixa = faixa.toString()

            if(faixas_selecionadas > 0){
                if(!queue_local.includes(faixas[alvo][faixa]) && faixas[alvo][faixa] != null){
                    queue_local.push(faixas[alvo][faixa]);
                    contador++;
                }
            }else{
                queue_local.push(faixas[alvo][faixa]);
                break;
            }

            if(contador == faixas_selecionadas) // Encerra o loop caso tenha escolhido todas as faixas
                break;

        }while(queue_local.includes(faixas[alvo][faixa]) || contador < faixas_selecionadas);

        if(faixas_selecionadas > 0){
            if((args.includes("ms")))
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas escolhidas automaticamente estão na playlist, use `.aspl` para ver elas.");
            else if(args.includes("me"))
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas zueiras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
            else
                message.channel.send(`${message.author} `+ faixas_selecionadas + " trilhas sonoras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
        }

        if(faixas_selecionadas == 0 && queue_local.length > 1)
            message.channel.send(`:cd: Faixa aleatória adicionada a fila`);

        playlists.set(id_canal, queue_local)

        if(_ativo == 0){
            message.member.voice.channel.join()
            .then(connect => {

                connection = connect;
                atividade_bot.set(id_canal, 1)

                message.channel.send("Ok, som na caixa DJ :sunglasses: :metal:");
                tocar(message, client, args, playlists, atividade_bot, feedback_faixa)
            });
        }
    }
}