const ytdl = require('ytdl-core');
const tocar = require('./tocar.js')
const getyoutubelinks = require("@joshyzou/getyoutubelinks");

module.exports = async ({client, message, args}) => {

    if(!message.member.voice.channel){
        message.channel.send("Entre em um canal de voz para utilizar estes comandos")
        return
    }

    let Vchannel = message.member.voice.channel

    id_canal = Vchannel.id
    id_canal = id_canal.toString()

    if(typeof nome_faixas == "undefined")
        nome_faixas = new Map()

    if(typeof playlists == "undefined")
        playlists = new Map()

    if(typeof atividade_bot == "undefined"){
        atividade_bot = new Map()
        atividade_bot.set(id_canal, 0)        
    }

    if(typeof repeteco == "undefined"){
        repeteco = new Map()
        repeteco.set(id_canal, 0)
    }
    
    if(typeof feedback_faixa == "undefined"){
        feedback_faixa = new Map()
        feedback_faixa.set(id_canal, 1)
    }

    if(typeof trava_pl == "undefined"){
        trava_pl = new Map()
        trava_pl.set(id_canal, 0)
    }

    if(typeof client.ativo == "undefined")
        client.ativo = 0;
    
    queue_local = playlists.get(id_canal)
    
    if(typeof queue_local == "undefined")
        queue_local = []
    
    if(message.content.includes(".asrm")){
        if(queue_local.length > 1)
            require('./remove')({message, args, playlists, nome_faixas, id_canal})
        else
            message.channel.send("Use `.assk` para pular a faixa atual")

        return
    }else if(message.content == ".asds"){
        require('./desconecta')({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot})
        return
    }else if(message.content.includes(".asfd") || message.content.includes(".asrp")){
        require('./organiza')({client, message, args, playlists, id_canal, repeteco, feedback_faixa})
        return
    }else if(message.content.includes(".assk")){
        require('./skip')({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal})
        return
    }else if(message.content == ".asnp"){
        require('./tocando')({message, playlists})
        return
    }else if(message.content == ".aspl"){
        require('./playlist')({client, message, playlists, nome_faixas, repeteco, trava_pl})
        return
    }else if(message.content.includes(".asra")){
        require('./random')({client, message, args, playlists, atividade_bot, feedback_faixa, id_canal})
        return
    }else if(message.content.includes(".asrs")){
        require('./organiza')({client, message, args, playlists, id_canal, repeteco, feedback_faixa, nome_faixas, atividade_bot, tocar})
        return
    }

    if(message.content == ".as"){
        message.channel.send("Informe algo além do `.as`\nPor exemplo, `.as simian segue` ou como `.as https://youtu.be/yBLdQ1a4-JI`")
        return
    }

    var pesquisa = "";
    for(var i = 0; i < args.length; i++){
        pesquisa += args[i] + " ";
    }
    
    let link = "";

    if(message.content.includes(".as") && args.length > 0){
        if(!pesquisa.includes("https:") && !pesquisa.includes(".com/watch?v=") && !pesquisa.includes("//youtu.be/")){

            pesquisa = pesquisa.slice(0, -1).toLowerCase();

            message.channel.send(":mag: Procurando por `"+ pesquisa +"`");

            link = await getyoutubelinks(pesquisa).catch(e => {
                message.channel.send(":no_entry_sign: "+ `${message.author} vídeo não encontrado`);
                return;
            });

            link = link.link;
        }else{
            link = args[0];
        }

        if(queue_local.length > 0){
            ytdl.getInfo(link)
            .then(info => {
                var titulo_faixa_preview = info.videoDetails.title;
                message.channel.send(":cd: [ `"+ titulo_faixa_preview +"` ] adicionado a fila");
            });
        }
    }

    if(queue_local.includes(link)){
        message.channel.send("Essa faixa já está tocando ou na fila, guentae!")
        return
    }

    queue_local.push(link)

    playlists.set(id_canal, queue_local)

    ativo_att = atividade_bot.get(id_canal)

    // Toca a url informada
    if(ativo_att == 0){
        message.channel.send("Ok, som na caixa DJ :sunglasses: :metal:");
        tocar(message, client, args, playlists, atividade_bot, repeteco, feedback_faixa)
    }
}