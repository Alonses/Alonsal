const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const getThumb = require('video-thumbnail-url');

var _ativo = 0;
var _queue = [];
var _DJ = [];
let _em_canal = 0;
var repeteco = 0;

var prefixos = "p st pl sk h re ra ds rp np";

module.exports = async function({message, args}) {

    var rand = 0;
    
    const iniciaStream = () => {
        dispatcher = connection.play(ytdl(_queue[0], {filter: "audioonly", quality: "highestaudio" }));
        
        if(repeteco != 1 || _queue.length > 5){
            ytdl.getInfo(_queue[0]).then(info => {
                var titulo_faixa = info.videoDetails.title;
                message.channel.send(":notes: Tocando agora [ `"+ titulo_faixa +"` ]");
            });
        }

        if(typeof desconecta != "undefined"){ // Desativa o desligamento
            clearTimeout(desconecta);
            desconecta = null;
            ativo = 1;
        }

        dispatcher.on("finish", (msg) => {
            var faixa_atual = _queue[0];

            if(msg == null){
                _queue.shift();
                _DJ.shift();
            }
            
            if(repeteco == 1){
                _queue.push(faixa_atual);
                return iniciaStream();
            }
            
            if(_queue.length)
                return iniciaStream();
            else{
                _ativo = 0;
                repeteco = 0;
                
                desconecta = setTimeout(() =>{
                    message.channel.send(`${message.author} Desconectei por inatividade`+" use `ãst` novamente para tocarmos algo :call_me:");
                    connection.disconnect();
                    _queue = [];
                    _DJ = [];
                    repeteco = 0;
                }, 90000);
            }
        });
    }

    if(args[0] == "h"){
        const embed = new Discord.MessageEmbed()
        .setColor('#29BB8E')
        .setDescription("> COMANDOS DAS MÚSICAS :musical_note:\n**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`ãst url`** | **`ãst`** - Entra num canal de voz e toca um url\n:page_with_curl: **`ãst pl`** - Mostra a playlist atual\n:fast_forward: **`ãst sk`** - Pula a faixa que está tocando\n:track_next: **`ãst sk all`** - Pula todas as faixas\n:repeat: **`ãst rp`** - Ativa/desativa o repeteco\n:radio: **`ãst np`** - Informações da faixa atual\n:wave: **`ãst ds`** - Desconecta o Alonso do canal de voz\n:cd: **`ãst ra`** | **`ãst ra 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`ãst re`** | **`ãst re 10`** - Escolhe uma ou várias músicas aleatórias zueiras");
        // \n**`ãst st`** - Pausa a reprodução\n**`ãst p`** - Resume a reprodução

        message.channel.send(embed);
    }

    if(message.member.voice.channel){
        if(typeof desconecta != "undefined"){
            clearTimeout(desconecta);
            desconecta = null;
        }

        if(args[0] == "p"){
            dispatcher.resume();
            message.channel.send(":arrow_forward: Som na caixa!");
        }

        if(args[0] == "st"){
            dispatcher.pause();
            message.channel.send(":pause_button: Pausado, digite `ãst p` para retomar.");
        }

        if(args[0] == "rp"){
            if(repeteco == 0){
                repeteco = 1;
                message.channel.send(":repeat: Repeteco ativado, use `ãst rp` novamente para desativar.");
            }else{
                repeteco = 0;
                message.channel.send(":arrow_forward: Repeteco desativado, use `ãst rp` para ativar.");
            }
        }

        if(args[0] == "np"){
            dados_np = await ytdl.getInfo(_queue[0]).then(info => info.videoDetails);
            
            thumb = await getThumb(_queue[0]).then(thumb_url => {
                return thumb_url;   
            });

            descricao = dados_np.description;

            if(descricao == null)
                descricao = "Sem descrição";
                
            const embed_np = new Discord.MessageEmbed()
                .setTitle(':notes: Tocando agora')
                .setColor('#29BB8E')
                .setThumbnail(thumb)
                .setDescription("-----------------------------\n**"+ dados_np.title +"**\n\n"+ dados_np.description);
                
            await message.channel.send(embed_np);
        }

        if(args[0] == "re"){ // Faixa aleatória
            var faixas = ["https://youtu.be/MmLPhOrPgPk", "https://youtu.be/aKdcUM2M5z4", "https://youtu.be/MwymbuznQH0", "https://youtu.be/rQzSiiRe6YM", "https://youtu.be/IipjAt4gz7s", "https://youtu.be/kcMV3c2MaOg", "https://youtu.be/1Tc4rTZrhcI", "https://youtu.be/kD3dZTDCa4U", "https://youtu.be/hQW1knSPP3I", "https://youtu.be/6Xc5-SmHQaM", "https://youtu.be/EtrodNQKZ8I", "https://youtu.be/cPJUBQd-PNM", "https://youtu.be/WZIGwN-5Ioo", "https://youtu.be/-ZZ2JZArJH4", "https://youtu.be/ZMFX84cZpPM", "https://youtu.be/NBmESMFmDPE", "https://youtu.be/hH9M-m3WD0g", "https://youtu.be/HjGp2aJ_EMA", "https://youtu.be/CAJWmkNXqlM", "https://youtu.be/LvkKOXkgUEc", "https://youtu.be/tVOycFbfIDA", "https://youtu.be/0q6yphdZhUA", "https://youtu.be/Fxh1rd_LTdg", "https://youtu.be/l5hvakZf8qw", "https://youtu.be/yyjUmv1gJEg", "https://youtu.be/F7LmomKM2rI", "https://youtu.be/FQxzx4JX13c"];

            var faixa = 0;
            var contador = 0;
            var faixas_selecionadas = 0;

            if(typeof args[1] != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
                faixas_selecionadas = parseInt(args[1]);
                
                if(faixas_selecionadas > 10){
                    message.channel.send(`${message.author} posso escolher até 10 músicas de memes aleatórias por vez, informe um número menor :P`);
                    return;
                }

                if(_queue.length > 25){
                    message.channel.send(`:minidisc: ${message.author} Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P`);
                    return;
                }
            }

            if(typeof args[1] == "undefined")
                message.channel.send("Escolhendo uma zueira aleatória");
            else
                message.channel.send("Escolhendo umas zueiras aleatoriamente");

            var faixa = 0;
            
            do{
                faixa = Math.round((faixas.length) * Math.random());
                
                args[0] = faixas[faixa];

                if(faixas_selecionadas > 0){
                    if(!_queue.includes(faixas[faixa])){
                        _queue.push(faixas[faixa]);
                        contador++;
                    }
                }

                if(contador == faixas_selecionadas) // Encerra o loop caso tenha escolhido todas as faixas
                    break;

            }while(_queue.includes(faixas[faixa]) || contador < faixas_selecionadas);

            if(faixas_selecionadas > 0){
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas zueiras adicionadas automaticamente estão na playlist, use `ãst pl` para ver elas.");

                if(_ativo == 0){
                    message.member.voice.channel.join()
                    .then(connect => {

                        connection = connect;
                        iniciaStream();
                        _ativo = 1;
                    });
                }

                return;
            }

            rand = 1;
        }
        
        if(args.includes("ra")){
            var faixas = ["https://youtu.be/WlTlUseVt7E", "https://youtu.be/EFEmTsfFL5A", "https://youtu.be/41nJVmBoQHM", "https://youtu.be/N3zf9q8mbWs", "https://youtu.be/pDJKgi2e-Aw", "https://youtu.be/iDH4p8UblI0", "https://youtu.be/CPQYhQlalgc", "https://youtu.be/Ndzln1UEyf0", "https://youtu.be/VONvSk9qEu8", "https://youtu.be/vCVRfvQxQQ4", "https://youtu.be/2vATGqooQMM", "https://youtu.be/Ij65wvAGX-c", "https://youtu.be/_66Y0KYCd_s", "https://youtu.be/G1rs6a8QILM", "https://youtu.be/iApyBcSg-WA", "https://youtu.be/7_9EQenu8mQ", "https://youtu.be/gNRNzOERHuY", "https://youtu.be/NF-kLy44Hls", "https://youtu.be/NFDmyNiTamQ", "https://youtu.be/lWxQ55EsOVs", "https://youtu.be/yl3TsqL0ZPw", "https://youtu.be/_mTRvJ9fugM", "https://youtu.be/JJHeEfe2uYw", "https://youtu.be/DeumyOzKqgI", "https://youtu.be/0siKyXL_h08", "https://youtu.be/h6o38MN8yqE", "https://youtu.be/7Mnm59MOwl4", "https://youtu.be/YCQYdgYG7uY", "https://youtu.be/d77gTBvX0K8", "https://youtu.be/fHI8X4OXluQ", "https://youtu.be/0wnuTGGuAVs", "https://youtu.be/sV1CaBtBMBg", "https://youtu.be/QIVyjLy4noE", "https://youtu.be/hqYYudHutsE", "https://youtu.be/4LJJNt2Rkgw", "https://youtu.be/PAUlCK8kuGU", "https://youtu.be/Lmh6KD1r3yc", "https://youtu.be/mSZXWdKSQNM", "https://youtu.be/TnlPtaPxXfc", "https://youtu.be/Qp6D71kQRhA", "https://youtu.be/r6oLw5gpO44", "https://youtu.be/mzkF-TZzoK0", "https://youtu.be/eWzPU_p7I7g", "https://youtu.be/udldOUORlPw", "https://youtu.be/emjLXdsj6xA", "https://youtu.be/v8Psvxk9tjA", "https://youtu.be/DCkkv89fHy0", "https://youtu.be/XleOeDOLi5Y", "https://youtu.be/cZag0E32is0", "https://youtu.be/e1FN047_LT0", "https://youtu.be/G2z7jgFN97w"];
            
            var faixa = 0;
            var contador = 0;
            var faixas_selecionadas = 0;

            if(typeof args[1] != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
                faixas_selecionadas = parseInt(args[1]);
                
                if(faixas_selecionadas > 10){
                    message.channel.send(`${message.author} posso escolher até 10 músicas aleatórias por vez, informe um número menor :P`);
                    return;
                }

                if(_queue.length > 25){
                    message.channel.send(`:minidisc: ${message.author} Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P`);
                    return;
                }
            }

            if(typeof args[1] == "undefined")
                message.channel.send("Escolhendo uma música aleatória");
            else
                message.channel.send("Escolhendo umas músicas aleatoriamente");

            do{
                faixa = Math.round((faixas.length) * Math.random());
                
                args[0] = faixas[faixa];

                if(faixas_selecionadas > 0){
                    if(!_queue.includes(faixas[faixa])){
                        _queue.push(faixas[faixa]);
                        contador++;
                    }
                }

                if(contador == faixas_selecionadas) // Encerra o loop caso tenha escolhido todas as faixas
                    break;

            }while(_queue.includes(faixas[faixa]) || contador < faixas_selecionadas);

            if(faixas_selecionadas > 0){
                message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas escolhidas automaticamente estão na playlist, use `ãst pl` para ver elas.");

                if(_ativo == 0){
                    message.member.voice.channel.join()
                    .then(connect => {

                        connection = connect;
                        iniciaStream();
                        _ativo = 1;
                    });
                }

                return;
            }

            rand = 1;
        }

        if(args[0] == "pl"){
            if(_queue.length > 0){
                const m = await message.channel.send(":control_knobs: Ordenando as músicas da playlist, aguarde um pouco :P");

                if(_queue.length > 1)
                    var faixas_demonst = "\n-----------------------------\n\n> Próximas :floppy_disk:\n";
                else
                    var faixas_demonst = "";

                for(var faixa_in = 0; faixa_in < _queue.length - 1; faixa_in++){
                    if(typeof _queue[faixa_in + 1] != "undefined"){
                        faixas_ = await ytdl.getInfo(_queue[faixa_in + 1]).then(info => info.videoDetails.title);
                        faixas_demonst += "**`"+ (faixa_in + 2) +"`** - `" + faixas_ + "`\n";
                    }
                }

                titulo = await ytdl.getInfo(_queue[0]).then(info => info.videoDetails.title);
                
                const embed = new Discord.MessageEmbed()
                .setTitle('Playlist')
                .setColor('#29BB8E')
                .setDescription("> Tocando Agora :notes:\n **`1`** - [ `"+ titulo +"` ]"+ faixas_demonst);

                m.edit(`:page_with_curl: Tudo certo, sua playlist está abaixo //`, embed);
            }else
                message.channel.send("Não há nenhuma faixa tocando no momento.");
        }else if(args[0] == "sk"){
            if(args[1] != "all"){
                _queue.shift();
                _DJ.shift();

                if(_queue.length > 0)
                    message.channel.send(":fast_forward: Pulando para a próxima faixa");
                
                dispatcher.end("skip");

                if(_queue.length > 0)
                    return iniciaStream();
                else
                    message.channel.send(":free: Playlist finalizada!");
            }else{
                if(_queue.length > 0){
                    message.channel.send(":track_next: Pulando todas as faixas");

                    _queue = [];
                    _DJ = [];
                    ativo = 0;
                    repeteco = 0;

                    dispatcher.end();
                    return;
                }
            }
        }else if(args[0] == "sk")
            message.channel.send("Inicie alguma música com `ãst url` ou `ãst ra` para poder pular.");

        if(args[0] != "ds"){
            message.member.voice.channel.join()
            .then(connect => { // Conectar e tocar

                let link = args[0];
                _em_canal = 1;
                
                if(ytdl.validateURL(link)){
                    if(_queue.includes(link))
                        message.channel.send("Essa faixa já está tocando ou na fila, guentae!");
                    else if(_queue.length > 0){
                        try{
                            if(rand == 0){
                                ytdl.getInfo(link)
                                .then(info => {
                                    var titulo_faixa_preview = info.videoDetails.title;
                                    message.channel.send(":cd: [ `"+ titulo_faixa_preview +"` ] adicionado a fila");
                                });
                            }else
                                message.channel.send(`:cd: Faixa aleatória adicionada a fila`);

                            _queue.push(link);
                            _DJ.push(message.author.id);
                        }catch(e){
                            message.channel.send(":wrench: Eita! O vídeo inserido não pode ser reproduzido. :pensive:");
                        }
                    }else{
                        // Adiciona a faixa na lista
                        _queue.push(link);
                        _DJ.push(message.author.id);

                        if(_ativo == 0){ // Inicia a 1° vez a reprodução das faixas
                            message.channel.send("Ok, som na caixa DJ :sunglasses: :metal:");
                            
                            connection = connect;
                            iniciaStream(args[0]);
                            
                            _ativo = 1;
                        }
                    }
                }else{
                    var entrada = "";

                    if(typeof args[0] != "undefined"){
                        entrada = args[0].toString();
                        entrada = entrada.replace(" ", "");
                    }

                    if(typeof entrada != "undefined")
                        if(entrada.length > 0 && !prefixos.includes(entrada))
                            message.channel.send("O link informado não é válido, forneça um link do youtube.");
                    else if(!prefixos.includes(entrada))
                        message.channel.send("Olá! Envie um link com `ãst url` ou `ãst ra` para tocarmos por aqui.");
                }
            });
        }
    }else
        message.channel.send("Entre em um canal de voz p/ poder utilizar estes comandos.");
        
    if(args[0] == "ds" && _em_canal == 1){ // Desconectar
        _ativo = 0;
        _em_canal = 0;

        _queue = [];
        _DJ = [];
        repeteco = 0;

        message.member.voice.channel.leave();
        message.channel.send("Até mais :stuck_out_tongue_winking_eye: :call_me: ");
    }else if(typeof args[0] != "undefined")
        if(args[0] == "ds" && _em_canal == 0)
            message.channel.send("Eu nem entrei num canal de voz como vou sair? :v");
}