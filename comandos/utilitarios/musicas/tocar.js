const ytdl = require('ytdl-core');

module.exports = async (message, client, args, playlists, atividade_bot, repeteco, feedback_faixa, condicao_auto) => {
    
    let Vchannel = message.member.voice.channel
    let connection = await Vchannel.join()
    
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

    if(!Vchannel){
        await message.channel.send('Entre em um canal de voz p/ utilizar estes comandos')
        return
    }

    if(cond_auto != "end"){
        if(!ytdl.validateURL(queue_local[0])){
            await message.channel.send('Informe um link adequado')
            client.queue.shift()
            
            return
        }
    }

    tocar_faixa()
   
    function tocar_faixa(){
        atividade_bot.set(id_canal, 1)

        if(typeof inativo != "undefined") // Desativa o desligamento
            clearTimeout(inativo);

        let music = ''

        if(cond_auto != "end"){
            queue_interna = playlists.get(id_canal)
            music = ytdl(queue_interna[0]);
        }

        let dispatcher = connection.play(music);

        if(cond_auto == "end")
            dispatcher.end()

        if((repeteco_ != 1 || queue_interna.length > 5 ) && feedback_f == 1 && cond_auto != "end"){
            ytdl.getInfo(queue_interna[0]).then(info => {
                var titulo_faixa = info.videoDetails.title;

                if(Vchannel)
                    message.channel.send(":notes: Tocando agora [ `"+ titulo_faixa +"` ]");
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

            if(queue_interna.length > 0 && cond_auto != "end")
                return tocar_faixa()
            else
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