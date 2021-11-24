module.exports = async ({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot, id_canal_desconectado}) => {
    
    const idioma_selecionado = client.idioma.getLang(message.guild.id);

    frases = ["Até mais :call_me:", "Hasta la vista, baby :alien:", "Ovo dormir :zzz:", "Dá um alô dps :v:"];

    if(idioma_selecionado == "en-us")
        frases = ["See you later :call_me:", "Hasta la vista, baby :alien:", "I am going to sleep :zzz:", "Call me later :v:"];

    message.member.voice.channel.leave();

    let id_alvo = id_canal;

    if(typeof id_canal_desconectado !== "undefined"){
        id_alvo = id_canal_desconectado;
        if(idioma_selecionado == "pt-br")
            message.reply("Mi derrubaram aq ó :crocodile:");
        else
            message.reply("They knocked me down here :crocodile:");
    }else
        message.reply(frases[Math.round((frases.length - 1) * Math.random())]);

    await playlists.set(id_alvo, []);
    await nome_faixas.set(id_alvo, []);
    await repeteco.set(id_alvo, 0);
    await feedback_faixa.set(id_alvo, 1);
    await atividade_bot.set(id_alvo, 0);
    
    if(typeof inativo != "undefined")
        clearTimeout(inativo);
}