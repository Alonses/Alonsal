module.exports = async function({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot}){

    playlists.set(id_canal, [])
    nome_faixas.set(id_canal, [])
    repeteco.set(id_canal, 0)
    feedback_faixa.set(id_canal, 1)
    atividade_bot.set(id_canal, 0)
    
    message.member.voice.channel.leave()
    message.channel.send("Até mais :stuck_out_tongue_winking_eye: :call_me: ")
}