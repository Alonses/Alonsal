const faixas = require('../../arquivos/json/text/faixas.json');
const tocar = require('./tocar.js');

module.exports = async function({message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, id_canal}){
        
    const { musicas } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

    let queue_local = playlists.get(id_canal);
    let faixas_locais = nome_faixas.get(id_canal);
    let _ativo = atividade_bot.get(id_canal);

    if(typeof queue_local === "undefined")
        queue_local = [];
    
    if(typeof faixas_locais === "undefined")
        faixas_locais = [];

    if(typeof _ativo == "undefined")
        _ativo = 0;
    
    if(args.length == 1){
        message.reply(musicas[2]["aviso_1"]);
        return;
    }

    let tipo_random = args[1];
    let quantidade_faixas = args[2];

    if(tipo_random === "ms" || tipo_random === "me" || tipo_random === "jg" || tipo_random === "op"){
        
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
                    message.reply(musicas[2]["aviso_2"]);
                else if(tipo_random === "me")
                    message.reply(musicas[2]["aviso_3"]);
                else if(tipo_random === "jg")
                    message.reply(musicas[2]["aviso_4"]);
                else
                    message.reply(musicas[2]["aviso_5"]);

                return;
            }

            if(queue_local.length > 15){
                message.reply(":minidisc: | "+ musicas[2]["album_completo"]);
                return;
            }
        }

        if(typeof quantidade_faixas === "undefined" || faixas_selecionadas === 1)
            if(tipo_random === "ms")
                message.channel.send(musicas[2]["escolhendo_1"]);
            else if(tipo_random === "me")
                message.channel.send(musicas[2]["escolhendo_2"]);
            else if(tipo_random === "jg")
                message.channel.send(musicas[2]["escolhendo_3"]);
            else
                message.channel.send(musicas[2]["escolhendo_4"]);

        let url_escolhida = "";
        
        do{
            let faixa = Math.round((faixas[alvo].length - 1) * Math.random());
            
            url_escolhida = Object.keys(faixas[alvo][faixa]);
            let nome_faixa = faixas[alvo][faixa][url_escolhida];

            url_escolhida = url_escolhida[0];

            if(faixas_selecionadas > 0){
                if(!queue_local.includes(url_escolhida)){
                    queue_local.push(url_escolhida);
                    faixas_locais.push(nome_faixa);
                    contador++;
                }
            }else{
                queue_local.push(url_escolhida);
                faixas_locais.push(nome_faixa);
                break;
            }

            if(contador == faixas_selecionadas) // Encerra o loop caso tenha escolhido todas as faixas
                break;

        }while(queue_local.includes(url_escolhida) || contador < faixas_selecionadas);

        if(faixas_selecionadas > 1){
            if((args.includes("ms")))
                message.reply(faixas_selecionadas +" "+ musicas[2]["escolhidas_1"]);
            else if(args.includes("me"))
                message.reply(faixas_selecionadas +" "+ musicas[2]["escolhidas_2"]);
            else if(args.includes("jg"))
                message.reply(faixas_selecionadas +" "+ musicas[2]["escolhidas_3"]);
            else
                message.reply(faixas_selecionadas +" "+ musicas[2]["escolhidas_4"]);
        }

        if(faixas_selecionadas === 0 && queue_local.length > 1)
            message.reply(musicas[2]["adicionado"]);

        playlists.set(id_canal, queue_local);
        nome_faixas.set(id_canal, faixas_locais);

        if(_ativo === 0){
            message.member.voice.channel.join()
            .then(connect => {

                connection = connect;
                atividade_bot.set(id_canal, 1);

                if(tipo_random !== "op")
                    message.reply(musicas[0]["iniciando_repro"]);
                else
                    message.reply(musicas[0]["aprecie"]);

                tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa);
            });
        }
    }
}