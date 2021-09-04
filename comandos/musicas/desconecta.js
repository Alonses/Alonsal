module.exports = async ({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot, id_canal_desconectado}) => {
    
    const frases = ["Até mais :call_me:", "Hasta la vista, baby :alien:", "Ovo dormir :zzz:", "Dá um alô dps :v:"];

    message.member.voice.channel.leave();

    let id_alvo = id_canal;

    if(typeof id_canal_desconectado !== "undefined"){
        id_alvo = id_canal_desconectado;
        message.lineReply("Mi derrubaram aq ó :crocodile:");
    }else
        message.lineReply(frases[Math.round((frases.length - 1) * Math.random())]);

    await playlists.set(id_alvo, []);
    await nome_faixas.set(id_alvo, []);
    await repeteco.set(id_alvo, 0);
    await feedback_faixa.set(id_alvo, 1);
    await atividade_bot.set(id_alvo, 0);
    
    if(typeof inativo != "undefined")
        clearTimeout(inativo);
}