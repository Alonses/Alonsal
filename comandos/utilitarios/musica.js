const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const getThumb = require('video-thumbnail-url');

var getyoutubelinks = require("@joshyzou/getyoutubelinks");

var prefixos = ["p", "st", "pl", "sk", "h", "re", "ra", "ds", "rp", "np", "fd"];

var serverID = 0;
var _ativo = 0;
var _queue = [];
var _queue_names = [];
var _DJ = [];
var _em_canal = 0;
var repeteco = 0;
var feedback_faixa = 1;
var trava_pl = 0;
var fator_renatos = 0;
var trava_renatao = 0;
var trava_sk = 0;

module.exports = async function({message, args}) {
    var rand = 0;

    if(message.guild.id == serverID || serverID == 0){ // Previne que o bot seja acionado na música em vários lugares ao mesmo tempo

        serverID = message.guild.id;

        const iniciaStream = () => {

            fator_renatos = 1;

            if(trava_renatao == 0)
                fator_renatos = Math.round(2 * Math.random());

            if(fator_renatos > 0){
                try{
                    console.log(_queue[0]);
                    dispatcher = connection.play(ytdl(_queue[0], {filter: "audioonly", quality: "highestaudio" }));
                }catch(error){
                    message.channel.send(":no_entry_sign:"+ `${message.author} não foi possível reproduzir este vídeo ${_queue[0]}`);
                    dispatcher.end();
                }
            }else if(trava_renatao == 0){
                trava_renatao = 1;
                trava_sk = 1;

                setTimeout(() => { // Libera a propaganda para aparecer novamente
                    trava_renatao = 0;
                }, 1800000);

                setTimeout(() => { // Trava o pulo da propaganda 
                    trava_sk = 0;
                }, 32000);

                message.channel.send(":cool: Patrocinador Alonsal");
                dispatcher = connection.play(ytdl("https://youtu.be/NRW-hLmGHX4", {filter: "audioonly", quality: "highestaudio" }))
            }

            if((repeteco != 1 || _queue.length > 5 ) && feedback_faixa == 1 && fator_renatos != 0){
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

                console.log("aq");
                console.log(fator_renatos);

                var faixa_atual = _queue[0];
                var nome_faixa = _queue_names[0];

                if(msg == null && fator_renatos > 0){
                    _queue.shift();
                    _DJ.shift();
                    _queue_names.shift();
                }
                
                if(repeteco == 1 && fator_renatos > 0){
                    _queue.push(faixa_atual);
                    _queue_names.push(nome_faixa);
                    return iniciaStream();
                }
                
                if(_queue.length){
                    return iniciaStream();
                }else{
                    _ativo = 0;
                    repeteco = 0;
                    
                    desconecta = setTimeout(() =>{
                        message.channel.send(`${message.author} Desconectei por inatividade`+" use `ãst` novamente para tocarmos algo :call_me:");
                        connection.disconnect();
                        _queue = [];
                        _DJ = [];
                        _queue_names = [];
                        
                        repeteco = 0;
                        serverID = 0;
                    }, 90000);
                }
            });
        }

        if(args[0] == "h"){
            const embed = new Discord.MessageEmbed()
            .setColor('#29BB8E')
            .setDescription("> COMANDOS DAS MÚSICAS :musical_note:\n**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`ãst url`** | **`ãst`** - Entra num canal de voz e toca um url\n:page_with_curl: **`ãst pl`** - Mostra a playlist atual\n:fast_forward: **`ãst sk`** - Pula a faixa que está tocando\n:track_next: **`ãst sk all`** - Pula todas as faixas\n:repeat: **`ãst rp`** - Ativa/desativa o repeteco\n:loudspeaker: **`ãst fd`** - Ativa/desativa o anúncio de faixas\n:radio: **`ãst np`** - Informações da faixa atual\n:wave: **`ãst ds`** - Desconecta o Alonso do canal de voz\n:cd: **`ãst ms`** | **`ãst ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`ãst me`** | **`ãst me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`ãst jg`** | **`ãst jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos");
            // \n**`ãst st`** - Pausa a reprodução\n**`ãst p`** - Resume a reprodução

            message.channel.send(embed);
            return;
        }

        if(message.member.voice.channel){
            if(typeof desconecta != "undefined"){
                clearTimeout(desconecta);
                desconecta = null;
            }

            if(args[0] == "p"){
                dispatcher.resume();
                message.channel.send(":arrow_forward: Som na caixa!");
                
                return;
            }

            if(args[0] == "st"){
                dispatcher.pause();
                message.channel.send(":pause_button: Pausado, digite `ãst p` para retomar.");

                return;
            }

            if(args[0] == "rp"){
                if(repeteco == 0){
                    repeteco = 1;
                    message.channel.send(":repeat: Repeteco ativado, use `ãst rp` novamente para desativar.");

                    if(_queue.length < 6)
                        message.channel.send(`${message.author} playlist pequena, irei parar de falar o nome das músicas quando elas iniciarem :man_detective:`);
                    else
                        message.channel.send(`${message.author} use`+ " `ãst fd` para desligar o anúncio de novas faixas :thumbsup:");
                }else{
                    repeteco = 0;
                    message.channel.send(":arrow_forward: Repeteco desativado, use `ãst rp` para ativar.");
                }

                return;
            }

            if(args[0] == "fd"){
                if(feedback_faixa == 0){
                    feedback_faixa = 1;
                    message.channel.send(":loudspeaker: Irei anunciar as faixas que começarem a tocar");
                }else{
                    feedback_faixa = 0;
                    message.channel.send("Ok, sem anúncios de faixas que começarem a tocar");
                }
                
                return;
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
                    .setTitle('Tocando agora :notes:')
                    .setColor('#29BB8E')
                    .setThumbnail(thumb)
                    .setDescription("-----------------------------\n**"+ dados_np.title +"**\nLink: "+ _queue[0] +"\n\n"+ dados_np.description);
                    
                await message.channel.send(embed_np);
                return;
            }

            if(args[0] == "ms" || args[0] == "me" || args[0] == "jg"){
                if(args[0] == "ms")
                    var faixas = ["https://youtu.be/WlTlUseVt7E", "https://youtu.be/2IA7QExh-NQ", "https://youtu.be/41nJVmBoQHM", "https://youtu.be/N3zf9q8mbWs", "https://youtu.be/pDJKgi2e-Aw", "https://youtu.be/iDH4p8UblI0", "https://youtu.be/CPQYhQlalgc", "https://youtu.be/Ndzln1UEyf0", "https://youtu.be/VONvSk9qEu8", "https://youtu.be/vCVRfvQxQQ4", "https://youtu.be/2vATGqooQMM", "https://youtu.be/Ij65wvAGX-c", "https://youtu.be/_66Y0KYCd_s", "https://youtu.be/G1rs6a8QILM", "https://youtu.be/iApyBcSg-WA", "https://youtu.be/7_9EQenu8mQ", "https://youtu.be/gNRNzOERHuY", "https://youtu.be/NF-kLy44Hls", "https://youtu.be/NFDmyNiTamQ", "https://youtu.be/lWxQ55EsOVs", "https://youtu.be/yl3TsqL0ZPw", "https://youtu.be/_mTRvJ9fugM", "https://youtu.be/JJHeEfe2uYw", "https://youtu.be/DeumyOzKqgI", "https://youtu.be/0siKyXL_h08", "https://youtu.be/h6o38MN8yqE", "https://youtu.be/7Mnm59MOwl4", "https://youtu.be/YCQYdgYG7uY", "https://youtu.be/d77gTBvX0K8", "https://youtu.be/fHI8X4OXluQ", "https://youtu.be/0wnuTGGuAVs", "https://youtu.be/sV1CaBtBMBg", "https://youtu.be/QIVyjLy4noE", "https://youtu.be/hqYYudHutsE", "https://youtu.be/4LJJNt2Rkgw", "https://youtu.be/PAUlCK8kuGU", "https://youtu.be/Lmh6KD1r3yc", "https://youtu.be/mSZXWdKSQNM", "https://youtu.be/TnlPtaPxXfc", "https://youtu.be/Qp6D71kQRhA", "https://youtu.be/r6oLw5gpO44", "https://youtu.be/mzkF-TZzoK0", "https://youtu.be/eWzPU_p7I7g", "https://youtu.be/udldOUORlPw", "https://youtu.be/emjLXdsj6xA", "https://youtu.be/v8Psvxk9tjA", "https://youtu.be/DCkkv89fHy0", "https://youtu.be/XleOeDOLi5Y", "https://youtu.be/cZag0E32is0", "https://youtu.be/e1FN047_LT0", "https://youtu.be/G2z7jgFN97w", "https://youtu.be/zz8frWcmthA", "https://youtu.be/2-ptLktOjrY", "https://youtu.be/BsrBxX9bRHg", "https://youtu.be/a0IqWr8srnA", "https://youtu.be/qglh-WA-5hM", "https://youtu.be/A-3dHwjFkG4", "https://youtu.be/8LeRAZae1zs", "https://youtu.be/QAo_Ycocl1E", "https://youtu.be/CVxMTl6cUSE", "https://youtu.be/JMKi9qVrGWM", "https://youtu.be/CAJWmkNXqlM", "https://youtu.be/tVOycFbfIDA", "https://youtu.be/OvzJZTkWYoY", "https://youtu.be/Xwy-3aI435o", "https://youtu.be/kDERlmd2NS4", "https://youtu.be/NR0UmZcf89E", "https://youtu.be/wuJIqmha2Hk", "https://youtu.be/-rD-0tlGGPo", "https://youtu.be/9t5OWixuUI8", "https://youtu.be/LrjdpNDfZLo", "https://youtu.be/NxxjLD2pmlk", "https://youtu.be/ASO_zypdnsQ", "https://youtu.be/i5_asj1BGFs", "https://youtu.be/izGwDsrQ1eQ", "https://youtu.be/rftTxmcLSfY", "https://youtu.be/atY7ymXAcRQ", "https://youtu.be/fGdUhosUwKc", "https://youtu.be/iTf-4of477Y", "https://youtu.be/pqrUQrAcfo4", "https://youtu.be/Qra0UnykZmI", "https://youtu.be/U3YZTYXftzg", "https://youtu.be/QgKYZWRH4DA", "https://youtu.be/7L_s2Udr0TQ", "https://youtu.be/Op9XFHzVZlo", "https://youtu.be/XsMpXczOIPs", "https://youtu.be/cDq6YksYw04", "https://youtu.be/ricvj03PHSU", "https://youtu.be/njvA03rMHx4", "https://youtu.be/85_FaBP3LvE", "https://youtu.be/v6ry27hut3M", "https://youtu.be/K1FlAphL2p8", "https://youtu.be/6nxls_nTUCE", "https://youtu.be/PJvsC2OFSZ0", "https://youtu.be/ReEgXh-wURs", "https://youtu.be/xOazTYPrt64", "https://youtu.be/FtXfOU07kfs"];
                else if(args[0] == "me")
                    var faixas = ["https://youtu.be/MmLPhOrPgPk", "https://youtu.be/aKdcUM2M5z4", "https://youtu.be/MwymbuznQH0", "https://youtu.be/rQzSiiRe6YM", "https://youtu.be/IipjAt4gz7s", "https://youtu.be/kcMV3c2MaOg", "https://youtu.be/wRvJh0dIHy0", "https://youtu.be/kD3dZTDCa4U", "https://youtu.be/hQW1knSPP3I", "https://youtu.be/6Xc5-SmHQaM", "https://youtu.be/EtrodNQKZ8I", "https://youtu.be/cPJUBQd-PNM", "https://youtu.be/WZIGwN-5Ioo", "https://youtu.be/-ZZ2JZArJH4", "https://youtu.be/ZMFX84cZpPM", "https://youtu.be/NBmESMFmDPE", "https://youtu.be/hH9M-m3WD0g", "https://youtu.be/HjGp2aJ_EMA", "https://youtu.be/LvkKOXkgUEc", "https://youtu.be/0q6yphdZhUA", "https://youtu.be/Fxh1rd_LTdg", "https://youtu.be/l5hvakZf8qw", "https://youtu.be/yyjUmv1gJEg", "https://youtu.be/F7LmomKM2rI", "https://youtu.be/FQxzx4JX13c", "https://youtu.be/kVGIIvnG1_E", "https://youtu.be/BtKg458XAHk", "https://youtu.be/FWAYD0c3AwE", "https://youtu.be/dv13gl0a-FA", "https://youtu.be/ljwUlY9WW1I", "https://youtu.be/n--UDPEG_Xc", "https://youtu.be/3V7wWemZ_cs", "https://youtu.be/j9V78UbdzWI", "https://youtu.be/Na6r5_XPOtk", "https://youtu.be/DI9T_vmNMpI", "https://youtu.be/O2unuzTR5GI", "https://youtu.be/8Bywna-xbgY", "https://youtu.be/hw0yaHubcrQ", "https://youtu.be/v6oHMrhe5yA"];
                else
                    var faixas = ["https://youtu.be/DTLfV7Ru5VY", "https://youtu.be/x23I8f9PwlI", "https://youtu.be/ehMCqtBBUXU", "https://youtu.be/jPE73zebjY8", "https://youtu.be/NktuYfIqWuA", "https://youtu.be/0d2scH8lBvA", "https://youtu.be/cy5PvLJW4PA", "https://youtu.be/atgjKEgSqSU", "https://youtu.be/0E5l2GHBxB8", "https://youtu.be/xLfm2nnCOpc", "https://youtu.be/-a4iQjoggfA", "https://youtu.be/wy74G4jIrFQ", "https://youtu.be/HcvKHX6kK6M", "https://youtu.be/YjQO9GOpx98", "https://youtu.be/OBQE_TNI7zw", "https://youtu.be/W4VTq0sa9yg", "https://youtu.be/jqE8M2ZnFL8", "https://youtu.be/JpTecQBxgIk", "https://youtu.be/2vRBjHY7ReE", "https://youtu.be/_3ngiSxVCBs", "https://youtu.be/7hT04AB1JU4", "https://youtu.be/ZkFpUQc3Y2o", "https://youtu.be/l7I8dYKeke8", "https://youtu.be/LOADdASJnak", "https://youtu.be/8KT7jcB72fQ", "https://youtu.be/b5kEK5B_WjA", "https://youtu.be/GyVG4vzOugc", "https://youtu.be/LFmnZ6VMd_4", "https://youtu.be/4NNsObVabcY"];

                var faixa = 0;
                var contador = 0;
                var faixas_selecionadas = 0;

                if(typeof args[1] != "undefined"){ // Usado para coletar o número de faixas que serão adicionadas de uma vez
                    faixas_selecionadas = parseInt(args[1]);
                    
                    if(faixas_selecionadas > 10){
                        if(args[0] == "ms")
                            message.channel.send(`${message.author} posso escolher até 10 músicas aleatórias por vez, informe um número menor :P`);
                        else if(args[0] == "me")
                            message.channel.send(`${message.author} posso escolher até 10 músicas de memes aleatórias por vez, informe um número menor :P`);
                        else
                            message.channel.send(`${message.author} posso escolher até 10 trilhas sonoras aleatórias por vez, informe um número menor :P`);
                        
                        return;
                    }

                    if(_queue.length >= 20){
                        message.channel.send(`:minidisc: ${message.author} Albúm completo! Vamos ouvir todas essas faixas antes de adicionar outras? :P`);
                        return;
                    }
                }

                if(typeof args[1] == "undefined")
                    if(args[0] == "ms")
                        message.channel.send("Escolhendo uma música aleatória");
                    else if(args[0] == "me")
                        message.channel.send("Escolhendo uma zueira aleatória");
                    else
                        message.channel.send("Escolhendo uma trilha sonora aleatória");

                do{
                    faixa = Math.round((faixas.length) * Math.random());
                    
                    if(faixas_selecionadas > 0){
                        if(!_queue.includes(faixas[faixa]) && faixas[faixa] != null){
                            _queue.push(faixas[faixa]);
                            contador++;
                        }
                    }else
                        args[0] = faixas[faixa];

                    if(contador == faixas_selecionadas) // Encerra o loop caso tenha escolhido todas as faixas
                        break;

                }while(_queue.includes(faixas[faixa]) || contador < faixas_selecionadas);

                if(faixas_selecionadas > 0){
                    if((args.includes("ms")))
                        message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas escolhidas automaticamente estão na playlist, use `ãst pl` para ver elas.");
                    else if(args.includes("me"))
                        message.channel.send(`${message.author} `+ faixas_selecionadas + " faixas zueiras adicionadas automaticamente na playlist, use `ãst pl` para ver elas.");
                    else
                        message.channel.send(`${message.author} `+ faixas_selecionadas + " trilhas sonoras adicionadas automaticamente na playlist, use `ãst pl` para ver elas.");

                    if(_ativo == 0){
                        message.member.voice.channel.join()
                        .then(connect => {

                            connection = connect;
                            iniciaStream();
                            _ativo = 1;
                            _em_canal = 1;
                        });
                    }
                    return;
                }
                rand = 1;
            }

            if(args[0] == "pl"){
                if(trava_pl == 0){

                    trava_pl = 1;

                    if(_queue.length > 0){
                        const m = await message.channel.send(":control_knobs: Ordenando as músicas da playlist, aguarde um pouco :P");

                        if(_queue.length > 1)
                            var faixas_demonst = "\n-----------------------------\n\n> **Próximas** :floppy_disk: ";
                        else
                            var faixas_demonst = "";
                        
                        if(repeteco == 1)
                            faixas_demonst += "[ :repeat: O Repeteco está ativo ]\n";
                        else
                            faixas_demonst += "\n";
                        
                        // Controla a posicao que irá começar a buscar novamente
                        indice_seg = 0;
                        if(_queue_names.length > 0)
                            indice_seg = _queue_names.length;

                        for(faixa_in = indice_seg; faixa_in < _queue.length - 1; faixa_in++){
                            if(typeof _queue[faixa_in + 1] != "undefined"){
                                try{
                                    if(_queue_names.length < _queue.length){
                                        if(_queue.length < 10) // Para playlists menores que 10 faixas
                                            faixas_ = await ytdl.getInfo(_queue[faixa_in + 1]).then(info => info.videoDetails.title);
                                        else // Para playlist maiores de 10 faixas
                                            faixas_ = await ytdl.getInfo(_queue[faixa_in]).then(info => info.videoDetails.title);

                                        if(!_queue_names.includes(faixas_))
                                            _queue_names.push(faixas_);
                                    }
                                }catch(e){
                                    console.log(":construction: Erro ao buscar informações de uma faixa");
                                    return;
                                }
                            }
                        }

                        titulo = await ytdl.getInfo(_queue[0]).then(info => info.videoDetails.title);

                        if(!_queue_names.includes(titulo))
                            _queue_names.unshift(titulo);

                        for(var tfp = 1; tfp < _queue_names.length; tfp++){
                            faixas_demonst += "**`"+ (tfp + 1) +"`** - `" + _queue_names[tfp] + "`\n";
                        }

                        const embed = new Discord.MessageEmbed()
                        .setTitle('Playlist')
                        .setColor('#29BB8E')
                        .setThumbnail('https://maxcdn.icons8.com/Color/PNG/512/Music/playlist-512.png')
                        .setDescription("> **Tocando Agora** :notes:\n **`1`** - [ `"+ titulo +"` ]"+ faixas_demonst)
                        .setAuthor(message.author.username);
                        
                        m.edit(`:page_with_curl: Tudo certo ${message.author}, a playlist está abaixo //`, embed);

                        trava_pl = 0;
                    }else{
                        message.channel.send("Não há nenhuma faixa tocando no momento.");
                        trava_pl = 0;
                    }
                }else
                    message.channel.send(`:name_badge: ${message.author} um momento, estou processando a playlist ainda.`);

                    return;
            }else if(args[0] == "sk"){

                if(trava_sk == 1){
                    if(message.author.id == "665002572926681128"){
                        fator_renatos = 1;
                        iniciaStream();
                    }else
                        message.channel.send(`${message.author} Ouve o nosso patrocinador meo!`);
                    
                    return;
                }

                var pular_para;

                if(_queue.length > 0){
                    if(args[1] != "all"){

                        if(typeof args[1] != "undefined"){
                            pular_para = parseInt(args[1])
                            
                            if(pular_para == 1){
                                message.channel.send(`${message.author} não tem como pular para a faixa atual :v`);
                                return;
                            }

                            message.channel.send(":fast_forward: Pulando para a faixa `"+ pular_para +"`");

                            if(pular_para <= _queue.length){
                                for(var i = 1; i < pular_para; i++){

                                    var faixa_atual = _queue[0];
                                    var nome_faixa = _queue_names[0];

                                    _queue.shift();
                                    _DJ.shift();
                                    _queue_names.shift();

                                    if(repeteco == 1 && !_queue.includes(faixa_atual) && i != pular_para - 1){
                                        _queue.push(faixa_atual);
                                        _queue_names.push(nome_faixa);
                                    }
                                }
                            }else{
                                message.channel.send(`:interrobang: ${message.author} o número informado é maior que a playlist atual`);
                                return;
                            }
                        }else{
                            var faixa_atual = _queue[0];
                            var nome_faixa = _queue_names[0];

                            _queue.shift();
                            _DJ.shift();
                            _queue_names.shift();
                        }

                        if(repeteco == 1){
                            _queue.push(faixa_atual);
                            _queue_names.push(nome_faixa);
                        }

                        if(_queue.length > 0 && typeof pular_para != "number")
                            message.channel.send(":fast_forward: Pulando para a próxima faixa");
                        
                        dispatcher.end("skip");

                        if(_queue.length > 0)
                            return iniciaStream();
                        else
                            if(repeteco != 1){
                                message.channel.send(":free: Playlist finalizada!");
                                trava_pl = 0;
                            }
                        return;
                    }else{
                        if(_queue.length > 0){
                            message.channel.send(":track_next: Pulando todas as faixas");

                            _queue = [];
                            _DJ = [];
                            _queue_names = [];
                            ativo = 0;
                            repeteco = 0;
                            trava_pl = 0;
                            
                            dispatcher.end();
                            return;
                        }
                    }
                }else if(args[0] == "sk"){
                    message.channel.send("Inicie alguma música com `ãst url` ou `ãst ra` para poder pular.");
                    return;
                }
            }
            
            var pesquisa = "";
            for(var i = 0; i < args.length; i++){
                pesquisa += args[i] + " ";
            }
            
            let link = "";

            if(!prefixos.includes(args[0]) && args.length > 0){
                if(!pesquisa.includes("https:") && !pesquisa.includes(".com/watch?v=") && !pesquisa.includes("//youtu.be/")){
                    message.channel.send(":mag: Procurando por `"+ pesquisa +"`");

                    link = await getyoutubelinks(pesquisa).catch(e => {
                        message.channel.send(":no_entry_sign: "+ `${message.author} vídeo não encontrado`);
                        return;
                    });

                    link = link.link;
                }else{
                    link = args[0];
                }
            }

            if(args[0] != "ds"){
                message.member.voice.channel.join()
                .then(connect => { // Conectar e tocar

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
                                iniciaStream();

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
            _queue_names = [];
            repeteco = 0;
            serverID = 0;

            message.member.voice.channel.leave();
            message.channel.send("Até mais :stuck_out_tongue_winking_eye: :call_me: ");
        }else if(typeof args[0] != "undefined")
            if(args[0] == "ds" && _em_canal == 0)
                message.channel.send("Eu nem entrei num canal de voz como vou sair? :v");
    }else
        message.channel.send(`${message.author} segura um pouco ae, por enquanto só posso tocar músicas em um server por vez ;P`);
}
