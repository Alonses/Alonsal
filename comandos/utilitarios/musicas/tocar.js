const Discord = require('discord.js')
const ytdl = require('ytdl-core');
const getThumb = require('video-thumbnail-url');

if(typeof requisicoes == "undefined")
    requisicoes = []

if(typeof requisicao_ativa == "undefined")
    requisicao_ativa = 0

module.exports = async (message, client, args, playlists, atividade_bot, repeteco, feedback_faixa, condicao_auto) => {
    
    let Vchannel = message.member.voice.channel
    let connection = await Vchannel.join()
    
    if(!Vchannel){
        await message.channel.send('Entre em um canal de voz p/ utilizar estes comandos')
        return
    }

    id_canal = Vchannel.id
    id_canal = id_canal.toString()
    cond_auto = "init"

    if(condicao_auto == "end" && typeof condicao_auto != "undefined")
        cond_auto = "end"

    if(typeof repeteco != "undefined")
        repeteco_ = repeteco.get(id_canal)
    else
        repeteco_ = 0

    if(typeof feedback_faixa != "undefined")
        feedback_f = feedback_faixa.get(id_canal)
    else
        feedback_f = 1
    
    if(cond_auto != "end")
        queue_local = playlists.get(id_canal)
    else
        queue_local = []

    if(condicao_auto == "updt") // Utilizado para atualizar os valores
        return
    
    if(cond_auto != "end"){
        if(!ytdl.validateURL(queue_local[0])){
            await message.channel.send('Informe um link adequado')
            client.queue.shift()
            
            return
        }
    }

    if(requisicao_ativa == 0)
        tocar_faixa(id_canal)
    else
        requisicoes.push(id_canal)

    function requisita(){ // Fila de requisições para serem acionadas
        console.log("Requisições: "+ requisicoes +"\nStatus: "+ requisicao_ativa)

        if(requisicao_ativa == 0){
            tocar_faixa(requisicoes[0])
            requisicoes.shift()
        }
    }

    function tocar_faixa(id_canal){
        atividade_bot.set(id_canal, 1)

        if(typeof inativo != "undefined") // Desativa o desligamento
            clearTimeout(inativo);

        let music = ''

        if(cond_auto != "end"){
            requisicao_ativa = 1
            queue_interna = playlists.get(id_canal)
            // message.channel.send("Tentando tocar agora: "+ queue_interna[0])
            music = ytdl(queue_interna[0]);
        }

        let dispatcher = connection.play(music)

        setTimeout(() => {
            requisicao_ativa = 0

            if(requisicoes.length > 0)
                requisita()
        }, 1000)

        if(cond_auto == "end")
            dispatcher.end()

        if(cond_auto != "end"){
            if(feedback_f == 1 && (repeteco_ == 0 || queue_interna.length > 5))
            ytdl.getInfo(queue_interna[0]).then(info => {
                getThumb(queue_interna[0]).then(thumb_url => {

                    segundos = info.videoDetails.lengthSeconds
                    tempo = new Date(segundos * 1000).toISOString().substr(11, 8)
                    
                    tempo_c = tempo.parseInt()

                    if(tempo_c < 216000)
                        tempo = tempo.replace("00:", "")

                    const embed = new Discord.MessageEmbed()
                    .setTitle('Começando agora :loud_sound: :notes:')
                    .setColor('#29BB8E')
                    .setDescription(info.videoDetails.title +"\n\n**Duração: `"+ tempo +"`**\nUtilize `.asfd` para desativar o anúncio de faixas")
                    .setThumbnail(thumb_url)
                    .setTimestamp();

                    message.channel.send(embed);
                });
            });
        }

        dispatcher.on("finish", () => {

            if(typeof queue_interna == "undefined")
                return
            
            if(repeteco_ == 1){
                faixa_atual = queue_interna[0]
                queue_interna.shift()
                queue_interna.push(faixa_atual)
            }else
                queue_interna.shift()
            
            if(cond_auto != "end")
                playlists.set(id_canal, queue_interna)

            if(queue_interna.length > 0 && cond_auto != "end"){
                setTimeout(() => {
                    requisicoes.push(id_canal)
                    return requisita()
                }, 1000)
                
                return
            }else
                atividade_bot.set(id_canal, 0)

            inativo = setTimeout(() => {
                message.channel.send(`${message.author} Desconectei por inatividade`+" use `.as` novamente para tocarmos algo :call_me:")
                connection.disconnect()

                repeteco.set(id_canal, 0)
                atividade_bot.set(id_canal, 0)
            }, 180000);
        })
    }

    if(!client.VConnections) client.VConnections = {}
        client.VConnections[Vchannel.id] = connection 
}