module.exports = async function({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot}){
    
    message.member.voice.channel.leave()
    message.channel.send("Até mais :stuck_out_tongue_winking_eye: :call_me: ")

    await playlists.set(id_canal, [])
    await nome_faixas.set(id_canal, [])
    await repeteco.set(id_canal, 0)
    await feedback_faixa.set(id_canal, 1)
    await atividade_bot.set(id_canal, 0)
    
    if(typeof inativo != "undefined")
        clearTimeout(inativo)
}