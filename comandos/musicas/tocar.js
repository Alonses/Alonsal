const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const getThumb = require('video-thumbnail-url');

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
        await message.channel.send('Entre em um canal de voz p/ utilizar estes comandos');
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
            await message.channel.send('Informe um link adequado');
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

        let music;
        let faixa_atual;
        let queue_interna;
        let faixa_interna = [];

        queue_interna = playlists.get(id_canal);
        // console.log("queue_interna: "+ queue_interna +"\n\n");

        music = ytdl(queue_interna[0]);

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

        let dispatcher = connection.play(music);
        
        setTimeout(() => {
            requisicao_ativa = 0;

            if(requisicoes.length > 0)
                requisita();
        }, 1000);

        if(cond_auto !== "end"){
            if(feedback_f === 1 && (repeteco_ === 0 || queue_interna.length > 5))
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
                message.channel.send(`${message.author} `+"Não foi possível reproduzir a URL [ "+ queue_interna[0] +" ]\nUtilize `.assk` para pular para a próxima faixa\nUm relatório do problema foi despachado para correção.");

                let relatorio = "Não é possível reproduzir a URL [ "+ queue_interna[0] +" ], atualize ela para evitar futuros travamentos";

                client.channels.cache.get("862015290433994752").send(relatorio);
            }
        });

        dispatcher.on("finish", () => {
            if(typeof queue_interna === "undefined")
                return;
            
            if(queue_interna != playlists.get(id_canal)){ // Sincroniza os dados atualizados
                queue_interna = playlists.get(id_canal)
                faixa_interna = nome_faixas.get(id_canal);
            }

            if(repeteco_ === 1){
                let url_atual = queue_interna[0];
                queue_interna.shift();
                queue_interna.push(url_atual);

                faixa_interna.shift();
                faixa_interna.push(faixa_atual);
            }else{
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
            
                message.channel.send(`${message.author}`+" Estou sem faixas para tocar, bora ouvir mais? "+ emoji_dancando);
            }

            inativo = setTimeout(() => {
                message.channel.send(`${message.author} Desconectei por inatividade`+" use `.as` novamente para tocarmos algo :call_me:");
                connection.disconnect();

                repeteco.set(id_canal, 0);
                atividade_bot.set(id_canal, 0);
            }, 180000);
        });
    }

    if(!client.VConnections) client.VConnections = {}
        client.VConnections[Vchannel.id] = connection
}