const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const getThumb = require('video-thumbnail-url');

let fator_renatos = 0;
let trava_renatao = 0;

if(typeof requisicoes === "undefined")
    requisicoes = [];

if(typeof requisicao_ativa === "undefined")
    requisicao_ativa = 0;

module.exports = async (message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, condicao_auto) => {
    
    function emoji(id){
        return client.emojis.cache.get(id).toString();
    }
    
    let emoji_dancando = emoji('852873085664362507');

    let Vchannel = message.member.voice.channel;
    let connection = await Vchannel.join();
    let feedback_f = 1;
    let queue_local = [];
    let repeteco_ = 0;

    if(!Vchannel){
        await message.lineReply("Entre em um canal de voz p/ utilizar estes comandos");
        return;
    }

    id_canal = Vchannel.id;
    id_canal = id_canal.toString();
    cond_auto = "init";

    if(condicao_auto === "end" && typeof condicao_auto !== "undefined")
        cond_auto = "end";

    if(typeof repeteco !== "undefined")
        repeteco_ = repeteco.get(id_canal);

    if(typeof feedback_faixa !== "undefined")
        feedback_f = feedback_faixa.get(id_canal);
    
    if(cond_auto !== "end")
        queue_local = playlists.get(id_canal);

    if(cond_auto !== "end" && cond_auto !== "updt"){
        if(!ytdl.validateURL(queue_local[0])){
            await message.lineReply(":octagonal_sign: | Informe um link adequado");
            client.queue.shift();
            
            return;
        }
    }

    if(condicao_auto === "updt") // Utilizado para atualizar os valores
        return;

    if(requisicao_ativa === 0)
        tocar_faixa(id_canal);
    else
        requisicoes.push(id_canal);

    function requisita(){ // Fila de requisições para serem processadas
        if(requisicao_ativa === 0){
            tocar_faixa(requisicoes[0]);
            requisicoes.shift();
        }
    }

    function tocar_faixa(id_canal){
        atividade_bot.set(id_canal, 1);

        if(typeof inativo !== "undefined") // Desativa o desligamento
            clearTimeout(inativo);

        let faixa_atual;
        let queue_interna;
        let faixa_interna = [];

        queue_interna = playlists.get(id_canal);

        let music = ytdl(queue_interna[0]);

        if(cond_auto !== "end"){
            requisicao_ativa = 1;

            if(typeof nome_faixas !== "undefined" && nome_faixas.get(id_canal) !== 1){
                faixa_interna = nome_faixas.get(id_canal);
                if(typeof faixa_interna !== "undefined")
                    faixa_atual = faixa_interna[0];
                else
                    faixa_interna = [];
            }
        }

        fator_renatos = 1;

        if(trava_renatao == 0)
            fator_renatos = Math.round(2 * Math.random());

        if(fator_renatos > 0){
            try{
                dispatcher = connection.play(ytdl(queue_interna[0], {filter: "audioonly", quality: "highestaudio" }));
            }catch(error){
                message.lineReply(":no_entry_sign: | não foi possível reproduzir este vídeo "+ queue_interna[0]);
                dispatcher.end();
            }
        }else if(trava_renatao == 0){
            trava_renatao = 1;

            setTimeout(() => { // Libera a propaganda para aparecer novamente
                trava_renatao = 0;
            }, 1800000);

            message.channel.send(":cool: Patrocinador Alonsal!");
            dispatcher = connection.play(ytdl("https://youtu.be/NRW-hLmGHX4", {filter: "audioonly", quality: "highestaudio" }))
        }
        
        setTimeout(() => {
            requisicao_ativa = 0;

            if(requisicoes.length > 0)
                requisita();
        }, 1000);

        if(cond_auto !== "end"){
            if(feedback_f === 1 && ((repeteco_ === 0 || queue_interna.length > 5 ) && fator_renatos > 0))
            ytdl.getInfo(queue_interna[0][0]).then(info => {
                getThumb(queue_interna[0][0]).then(thumb_url => {
                    
                    faixa_atual = info.videoDetails.title;

                    faixa_interna[0] = faixa_atual;
                    nome_faixas.set(id_canal, faixa_interna);

                    segundos = info.videoDetails.lengthSeconds;
                    tempo = new Date(segundos * 1000).toISOString().substr(11, 8);
                    
                    tempo_c = tempo.split(":");
                    if(tempo_c[0] === "00")
                        tempo = tempo.replace("00:", "");

                    const embed = new Discord.MessageEmbed()
                    .setTitle('Começando agora :loud_sound: :notes:')
                    .setColor('#29BB8E')
                    .setDescription(faixa_atual +"\n\n**Duração: `"+ tempo +"`**\n:loudspeaker: Utilize `.asfd` para desativar o anúncio de faixas")
                    .setThumbnail(thumb_url)
                    .setTimestamp();

                    message.channel.send(embed);
                });
            });
        }else // Encerra tudo em caso de playlist vazia
            dispatcher.end();

        dispatcher.on("error", () => {
            if(cond_auto !== "end"){
                message.lineReply("Não foi possível reproduzir a URL [ "+ queue_interna[0] +" ]\nUtilize `.assk` para pular para a próxima faixa.");
            }
        });

        dispatcher.on("finish", () => {
            if(typeof queue_interna === "undefined")
                return;
            
            if(queue_interna != playlists.get(id_canal)){ // Sincroniza os dados atualizados
                queue_interna = playlists.get(id_canal);
                faixa_interna = nome_faixas.get(id_canal);
            }

            if(repeteco_ == 1 && fator_renatos > 0){
                let url_atual = queue_interna[0];
                queue_interna.shift();
                queue_interna.push(url_atual);

                faixa_interna.shift();
                faixa_interna.push(faixa_atual);
            }else if(fator_renatos > 0){
                queue_interna.shift();
                faixa_interna.shift();
            }

            playlists.set(id_canal, queue_interna);
            nome_faixas.set(id_canal, faixa_interna);

            if(queue_interna.length > 0 && cond_auto !== "end"){

                setTimeout(() => {
                    requisicoes.push(id_canal);
                    requisita();
                }, 1000);
                
                return;
            }else{
                atividade_bot.set(id_canal, 0);
            
                message.lineReply("Estou sem faixas para tocar, bora ouvir mais? "+ emoji_dancando);
            }

            inativo = setTimeout(() => {
                message.lineReply("Desconectei por inatividade use `.as` novamente para tocarmos algo :call_me:");
                connection.disconnect();

                repeteco.set(id_canal, 0);
                atividade_bot.set(id_canal, 0);
            }, 180000);
        });
    }

    if(!client.VConnections) client.VConnections = {};
        client.VConnections[Vchannel.id] = connection;
}