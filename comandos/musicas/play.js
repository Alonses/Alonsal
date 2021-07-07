const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const tocar = require('./tocar.js');
const getThumb = require('video-thumbnail-url');
const getyoutubelinks = require("@joshyzou/getyoutubelinks");

module.exports = async ({client, message, args}) => {

    if(!message.member.voice.channel){
        message.channel.send("Entre em um canal de voz para utilizar estes comandos");
        return;
    }

    let Vchannel = message.member.voice.channel;

    id_canal = Vchannel.id;
    id_canal = id_canal.toString();

    if(typeof nome_faixas == "undefined")
        nome_faixas = new Map();

    if(typeof playlists == "undefined")
        playlists = new Map();

    if(typeof atividade_bot == "undefined"){
        atividade_bot = new Map();
        atividade_bot.set(id_canal, 0);
    }

    if(typeof repeteco == "undefined"){
        repeteco = new Map();
        repeteco.set(id_canal, 0);
    }
    
    if(typeof feedback_faixa == "undefined"){
        feedback_faixa = new Map();
        feedback_faixa.set(id_canal, 1);
    }

    if(typeof trava_pl == "undefined"){
        trava_pl = new Map();
        trava_pl.set(id_canal, 0);
    }

    queue_local = playlists.get(id_canal);
    
    if(typeof queue_local == "undefined")
        queue_local = [];
    
    if(message.content.includes(".asrm")){
        if(queue_local.length != 0)
            require('./remove')({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal});
        else
            message.channel.send(":octagonal_sign: Inclua mais URL's na playlist para poder remover elas");
        
        return;
    }else if(message.content.includes(".asds")){
        require('./desconecta')({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot});
        return;
    }else if(message.content.includes(".assk")){
        require('./skip')({client, message, args, playlists, nome_faixas, repeteco, feedback_faixa, atividade_bot, tocar, id_canal});
        return;
    }else if(message.content.includes(".asnp")){
        require('./tocando')({message, playlists});
        return;
    }else if(message.content.includes(".aspl")){
        require('./playlist')({client, message, playlists, nome_faixas, repeteco, trava_pl});
        return;
    }else if(message.content.includes(".asra")){
        require('./random')({client, message, args, playlists, atividade_bot, repeteco, feedback_faixa, id_canal});
        return;
    }else if(message.content.includes(".asrs") || message.content.includes(".asfd") || message.content.includes(".asrp")){
        require('./organiza')({client, message, args, playlists, nome_faixas, id_canal, repeteco, feedback_faixa, atividade_bot, tocar});
        return;
    }

    if(message.content === ".as"){
        message.channel.send("Informe algo além de `.as`\nPor exemplo, `.as simian segue` ou como `.as https://youtu.be/yBLdQ1a4-JI`");
        return;
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
            });

            if(typeof link == "undefined")
                return;

            link = link.link;
        }else
            link = args[0];
        
        if(queue_local.length > 0){
            if(queue_local.includes(link)){
                message.channel.send("Essa faixa já está tocando ou na fila, guentae!");
                return;
            }

            ytdl.getInfo(link).then(info => {
                getThumb(link).then(thumb_url => {

                    segundos = info.videoDetails.lengthSeconds;
                    tempo = new Date(segundos * 1000).toISOString().substr(11, 8);
                    
                    tempo_c = tempo.split(":");
                    if(tempo_c[0] === "00")
                        tempo = tempo.replace("00:", "");
                    
                    const embed = new Discord.MessageEmbed()
                    .setTitle(':cd: Adicionado a fila')
                    .setColor('#29BB8E')
                    .setDescription(info.videoDetails.title +"\n\n**Duração: `"+ tempo +"`**\n:fast_forward: Utilize `.assk "+ queue_local.length +"` para pular até ela")
                    .setThumbnail(thumb_url)
                    .setTimestamp();

                    message.channel.send(embed);
                });
            });
        }
    }

    if(typeof link !== "undefined"){ // Confirma se o link do vídeo não está quebrado antes de adicionar
        info = await ytdl.getInfo(link)
        .catch(err => { message.channel.send(":no_entry_sign: "+ `${message.author} vídeo não encontrado`);});

        if(typeof info !== "undefined")
            queue_local.push(link);
        else
            return;
    }else
        message.channel.send(":no_entry_sign: "+ `${message.author} vídeo não encontrado`);
        
    playlists.set(id_canal, queue_local);

    ativo_att = atividade_bot.get(id_canal);

    // Toca a url informada
    if(ativo_att === 0){
        message.channel.send("Ok, som na caixa DJ :sunglasses: :metal:");
        tocar(message, client, args, playlists, nome_faixas, atividade_bot, repeteco, feedback_faixa);
    }
}