const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const getThumb = require('video-thumbnail-url');

let fator_renatos = 0;
let trava_renatao = 0;
let ultima_prop = null;

if(typeof requisicoes === "undefined")
    requisicoes = [];

if(typeof requisicao_ativa === "undefined")
    requisicao_ativa = 0;

module.exports = async (message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, condicao_auto) => {
    
    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

    const { propagandas } = require("../../arquivos/json/text/faixas.json");
    const { emojis_dancantes } = require("../../arquivos/json/text/emojis.json");

    let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

    let Vchannel = message.member.voice.channel;

    let feedback_f = 1;
    let queue_local = [];
    let repeteco_ = 0;

    if(!Vchannel){
        await message.lineReply(musicas[0]["aviso_1"]);
        return;
    }

    let id_canal = Vchannel.id;
    id_canal = id_canal.toString();
    let cond_auto = "init";

    if(condicao_auto === "end" && typeof condicao_auto !== "undefined")
        cond_auto = "end";

    if(typeof repeteco !== "undefined")
        repeteco_ = repeteco.get(id_canal);

    if(typeof feedback_faixa !== "undefined")
        feedback_f = feedback_faixa.get(id_canal);
    
    if(cond_auto !== "end")
        queue_local = playlists.get(id_canal);

    if(cond_auto !== "end" && condicao_auto !== "updt"){
        if(!ytdl.validateURL(queue_local[0])){
            await message.lineReply(":octagonal_sign: | "+ musicas[4]["aviso_1"]);
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
        feedback_f = feedback_faixa.get(id_canal);

        queue_interna = playlists.get(id_canal);

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
        let dispatcher;

        if(trava_renatao == 0)
            fator_renatos = Math.round(2 * Math.random());
            // fator_renatos = 0;

        if(fator_renatos > 0){
            try{
                dispatcher = connection.play(ytdl(queue_interna[0], { filter: "audioonly" }));
            }catch(error){
                message.lineReply(":no_entry_sign: | "+ musicas[4]["error_1"] +" [ "+ queue_interna[0] +" ]");
            }
        }else if(trava_renatao == 0){
            trava_renatao = 1;

            setTimeout(() => { // Libera as propagandas para aparecerem novamente
                trava_renatao = 0;
            }, 900000);

            let propaganda_atual;

            do{
                propaganda_atual = propagandas[Math.round((propagandas.length - 1) * Math.random())];
            }while(propaganda_atual == ultima_prop);

            ultima_prop = propaganda_atual;

            message.channel.send(musicas[4]["patrocinador"]);
            dispatcher = connection.play(ytdl(propaganda_atual , {
                filter: "audioonly",
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }));
        }
        
        setTimeout(() => {
            requisicao_ativa = 0;

            if(requisicoes.length > 0)
                requisita();
        }, 1000);

        if(cond_auto !== "end"){
            if(feedback_f === 1 && ((repeteco_ === 0 || queue_interna.length > 5 ) && fator_renatos > 0))
                ytdl.getInfo(queue_interna[0]).then(info => {
                    getThumb(queue_interna[0]).then(thumb_url => {
                        
                        faixa_atual = info.videoDetails.title;

                        faixa_interna[0] = faixa_atual;
                        nome_faixas.set(id_canal, faixa_interna);

                        segundos = info.videoDetails.lengthSeconds;
                        tempo = new Date(segundos * 1000).toISOString().substr(11, 8);
                        
                        tempo_c = tempo.split(":");
                        if(tempo_c[0] === "00")
                            tempo = tempo.replace("00:", "");

                        const embed = new Discord.MessageEmbed()
                        .setTitle(musicas[4]["comecando"])
                        .setColor('#29BB8E')
                        .setDescription(faixa_atual +"\n\n**"+ musicas[0]["duracao"] +": `"+ tempo +"`**\n:loudspeaker: "+ musicas[4]["anuncio_faixas"])
                        .setThumbnail(thumb_url)
                        .setTimestamp();

                        message.channel.send(embed);
                    });
                });
        }else // Encerra tudo em caso de playlist vazia
            dispatcher.end();

        dispatcher.on("error", () => {
            if(typeof queue_interna[0] !== "undefined"){
                message.lineReply(musicas[4]["error_2"] +" [ <"+ queue_interna[0] +"> ]\n"+ musicas[4]["skip"]);

                client.channels.cache.get('862015290433994752').send("Não foi possível reproduzir a URL [ "+ queue_interna[0] +" ], atualize o link para evitar futuros erros.");
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
            
                message.lineReply(musicas[4]["sem_faixas"] +" "+ emoji_dancando);
            }

            inativo = setTimeout(() => {
                message.lineReply(musicas[4]["desconectado"]);
                connection.disconnect();

                repeteco.set(id_canal, 0);
                atividade_bot.set(id_canal, 0);
            }, 180000);
        });
    }

    if(!client.VConnections) client.VConnections = {};
        client.VConnections[Vchannel.id] = connection;
}