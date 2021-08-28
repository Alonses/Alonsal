const faixas = require('../../arquivos/json/text/faixas.json');
const tocar = require('./tocar.js')

module.exports = async function({message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, id_canal}){
    let queue_local = playlists.get(id_canal);
    let _ativo = atividade_bot.get(id_canal);

    if(typeof queue_local == "undefined")
        queue_local = [];

    if(typeof _ativo == "undefined")
        _ativo = 0;
    
    if(args.length == 1){
        message.lineReply("Escreva como `.asra ms 2`, `.asra me 7`, `.asra jg 5` ou `.asra op 10` ;)");
        return;
    }

    let tipo_random = args[1];
    let quantidade_faixas = args[2];

    if(tipo_random === "ms" || tipo_random === "me" || tipo_random === "jg" || tipo_random === "op"){
        
        let faixa = 0;
        let contador = 0;
        let faixas_selecionadas = 0;
        let alvo = "musicas";

        if(tipo_random === "me")
            alvo = "memes";
        
        if(tipo_random === "jg")
            alvo = "trilhas";

        if(tipo_random === "op")
            alvo = "classicos";

        if(typeof quantidade_faixas != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
            faixas_selecionadas = parseInt(quantidade_faixas);
            
            if(faixas_selecionadas > 15){
                if(tipo_random === "ms")
                    message.lineReply("Posso escolher até 15 músicas aleatórias por vez, informe um número menor :P");
                else if(tipo_random === "me")
                    message.lineReply("Posso escolher até 15 músicas de memes aleatórias por vez, informe um número menor :P");
                else if(tipo_random === "jg")
                    message.lineReply("Posso escolher até 15 trilhas sonoras aleatórias por vez, informe um número menor :P");
                else
                    message.lineReply("Posso escolher até 15 músicas clássicas aleatórias por vez, informe um número menor :P");

                return;
            }

            if(queue_local.length > 15){
                message.lineReply(":minidisc: | Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P");
                return;
            }
        }

        if(typeof quantidade_faixas === "undefined" || faixas_selecionadas === 1)
            if(tipo_random === "ms")
                message.lineReply("Escolhendo uma música aleatória");
            else if(tipo_random === "me")
                message.lineReply("Escolhendo uma zueira aleatória");
            else if(tipo_random === "jg")
                message.lineReply("Escolhendo uma trilha sonora aleatória");
            else
                message.lineReply("Escolhendo uma composição clássica aleatória");

        do{
            faixa = 1 + Math.round((faixas[alvo].length - 1) * Math.random());
            
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

        if(faixas_selecionadas > 1){
            if((args.includes("ms")))
                message.lineReply(faixas_selecionadas + " faixas escolhidas automaticamente estão na playlist, use `.aspl` para ver elas.");
            else if(args.includes("me"))
                message.lineReply(faixas_selecionadas + " faixas zueiras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
            else if(args.includes("jg"))
                message.lineReply(faixas_selecionadas + " trilhas sonoras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
            else
                message.lineReply(faixas_selecionadas + " músicas clássicas foram adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
        }

        if(faixas_selecionadas === 0 && queue_local.length > 1)
            message.lineReply(":cd: Faixa aleatória adicionada a fila");

        playlists.set(id_canal, queue_local);

        if(_ativo === 0){
            message.member.voice.channel.join()
            .then(connect => {

                connection = connect;
                atividade_bot.set(id_canal, 1);

                if(tipo_random !== "op")
                    message.lineReply("Ok, som na caixa DJ :sunglasses: :metal:");
                else
                    message.lineReply("Ok, aprecie com moderação :musical_note:");

                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa);
            });
        }
    }
}