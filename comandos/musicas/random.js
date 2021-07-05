const faixas = require('../../arquivos/json/text/faixas.json');
const tocar = require('./tocar.js')

module.exports = async ({client, message, args, playlists, nome_faixas, atividade_bot, feedback_faixa, id_canal}) => {

    let queue_local = playlists.get(id_canal)
    let _ativo = atividade_bot.get(id_canal)

    if(typeof queue_local == "undefined")
        queue_local = []

    if(typeof _ativo == "undefined")
        _ativo = 0
    
    if(args.length == 0){
        message.channel.send("Informe algo além de `.asra`, como por exemplo, `.asra ms 5` | `.asra jg 8`")
        return
    }

    if(args[0] === "ms" || args[0] === "me" || args[0] === "jg" || args[0] === "op"){
        
        let faixa = 0;
        let contador = 0;
        let faixas_selecionadas = 0;
        let alvo = "musicas"

        if(args[0] === "me")
            alvo = "memes"
        
        if(args[0] === "jg")
            alvo = "trilhas"

        if(args[0] === "op")
            alvo = "classicos"

        if(typeof args[1] != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
            faixas_selecionadas = parseInt(args[1]);
            
            if(faixas_selecionadas > 15){
                if(args[0] === "ms")
                    message.channel.send(`${message.author} posso escolher até 15 músicas aleatórias por vez, informe um número menor :P`);
                else if(args[0] === "me")
                    message.channel.send(`${message.author} posso escolher até 15 músicas de memes aleatórias por vez, informe um número menor :P`);
                else if(args[0] === "jg")
                    message.channel.send(`${message.author} posso escolher até 15 trilhas sonoras aleatórias por vez, informe um número menor :P`);
                else
                    message.channel.send(`${message.author} posso escolher até 15 músicas clássicas aleatórias por vez, informe um número menor :P`);

                return;
            }

            if(queue_local.length > 15){
                message.channel.send(`:minidisc: ${message.author} Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P`);
                return;
            }
        }

        if(typeof args[1] === "undefined" || faixas_selecionadas === 1)
            if(args[0] === "ms")
                message.channel.send("Escolhendo uma música aleatória");
            else if(args[0] === "me")
                message.channel.send("Escolhendo uma zueira aleatória");
            else if(args[0] === "jg")
                message.channel.send("Escolhendo uma trilha sonora aleatória");
            else
                message.channel.send("Escolhendo uma composição clássica aleatória");

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
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas escolhidas automaticamente estão na playlist, use `.aspl` para ver elas.");
            else if(args.includes("me"))
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas zueiras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
            else if(args.includes("jg"))
                message.channel.send(`${message.author} `+ faixas_selecionadas + " trilhas sonoras adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
            else
                message.channel.send(`${message.author} `+ faixas_selecionadas + " músicas clássicas foram adicionadas automaticamente na playlist, use `.aspl` para ver elas.");
        }

        if(faixas_selecionadas === 0 && queue_local.length > 1)
            message.channel.send(`:cd: Faixa aleatória adicionada a fila`);

        playlists.set(id_canal, queue_local);

        if(_ativo === 0){
            message.member.voice.channel.join()
            .then(connect => {

                connection = connect;
                atividade_bot.set(id_canal, 1);

                if(args[0] !== "op")
                    message.channel.send("Ok, som na caixa DJ :sunglasses: :metal:");
                else
                    message.channel.send("Ok, aprecie com moderação :musical_note:");

                tocar(message, client, args, playlists, atividade_bot, feedback_faixa);
            });
        }
    }else
        message.channel.send(`${message.author} `+" escreva como `.asra ms 2`, `.asra me 7`, `.asra jg 5` ou `.asra op 10` ;)");
}