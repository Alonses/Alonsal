module.exports = async function({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal}){

    repeteco_ = repeteco.get(id_canal);
    feedback = feedback_faixa.get(id_canal);
    queue_local = playlists.get(id_canal);

    if(message.content === ".asrs" && message.author.id === "665002572926681128"){
        
        await playlists.set(id_canal, []);
        await nome_faixas.set(id_canal, []);
        await repeteco.set(id_canal, 0);
        await atividade_bot.set(id_canal, 0);

        tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa, "end");
        message.lineReply(':recycle: Reiniciando as configs Alonsais para músicas e playlists');
        return;
    }
    
    if(message.content === ".asrp"){
        if(repeteco_ === 0){
            await repeteco.set(id_canal, 1);
            message.lineReply(":repeat: Repeteco ativado, use `.asrp` novamente para desativar.");

            if(queue_local.length < 6)
                message.lineReply("Playlist pequena, irei parar de falar o nome das músicas quando elas iniciarem :man_detective:");
            else
                message.lineReply("Use `.asfd` para desligar o anúncio de novas faixas :thumbsup:");
        }else{
            await repeteco.set(id_canal, 0);
            message.lineReply(":arrow_forward: Repeteco desativado, use `.asrp` para ativar.");
        }
        
        return;
    }

    if(message.content === ".asfd"){
        msg = ":loudspeaker: Irei anunciar as faixas que começarem a tocar";

        if(feedback === 0)
            await feedback_faixa.set(id_canal, 1);
        else{
            await feedback_faixa.set(id_canal, 0);
            msg = "Ok, sem anúncios de faixas que começarem a tocar";
        }
        
        message.lineReply(msg);
        return;
    }
}