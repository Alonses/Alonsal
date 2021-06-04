const Discord = require('discord.js');
const ytdl = require('ytdl-core')

module.exports = async function({client, message, playlists, nome_faixas, repeteco, trava_pl}){

    if(typeof playlists.get(id_canal) != "undefined")
        queue_local = playlists.get(id_canal)
    else{
        message.channel.send("Não há faixas na playlist, adicione algumas para poder acessar este comando")
        return
    }

    queue_faixas = nome_faixas.get(id_canal)
    repeteco_ = repeteco.get(id_canal)
    trava_pl_l = trava_pl.get(id_canal)
    
    if(typeof queue_faixas == "undefined")
        queue_faixas = []

    if(typeof trava_pl_l == "undefined")
        trava_pl_l = 0

    if(trava_pl_l == 0){
        trava_pl.set(id_canal, 1)
        
        if(queue_local.length > 0){
            const m = await message.channel.send(":control_knobs: Ordenando as músicas da playlist, aguarde um pouco :P");

            faixas_demonst = "";

            if(queue_local.length > 1)
                var faixas_demonst = "\n-----------------------------\n\n> **Próximas** :floppy_disk: ";
            
            if(repeteco_ == 1)
                faixas_demonst += "[ :repeat: O Repeteco está ativo ]\n";
            else
                faixas_demonst += "\n";
            
            // Controla a posicao que irá começar a buscar novamente
            indice_seg = 0;
            if(nome_faixas.length > 0)
                indice_seg = nome_faixas.length;

            for(faixa_in = indice_seg; faixa_in < queue_local.length - 1; faixa_in++){
                if(typeof queue_local[faixa_in + 1] != "undefined"){
                    try{
                        if(queue_faixas.length != queue_local.length){
                            if(queue_local.length < 10) // Para playlists menores que 10 faixas
                                faixas_ = await ytdl.getInfo(queue_local[faixa_in + 1]).then(info => info.videoDetails.title);
                            else // Para playlist maiores de 10 faixas
                                faixas_ = await ytdl.getInfo(queue_local[faixa_in]).then(info => info.videoDetails.title);

                            if(!queue_faixas.includes(faixas_))
                            queue_faixas.push(faixas_)
                        }
                    }catch(e){
                        message.channel.send("Erro ao buscar informações de uma faixa")
                        return
                    }
                }
            }

            titulo = await ytdl.getInfo(queue_local[0]).then(info => info.videoDetails.title);

            if(!queue_faixas.includes(titulo))
                queue_faixas.unshift(titulo);

            for(var tfp = 1; tfp < queue_faixas.length; tfp++){
                faixas_demonst += "**`"+ (tfp + 1) +"`** - `" + queue_faixas[tfp] + "`\n"
            }

            const embed = new Discord.MessageEmbed()
            .setTitle('Playlist')
            .setColor('#29BB8E')
            .setThumbnail('https://maxcdn.icons8.com/Color/PNG/512/Music/playlist-512.png')
            .setDescription("> **Tocando Agora** :notes:\n **`1`** - [ `"+ titulo +"` ]"+ faixas_demonst)
            .setAuthor(message.author.username);
            
            m.edit(`:page_with_curl: Tudo certo ${message.author}, a playlist está abaixo //`, embed);

            trava_pl_l = 0
        }else{
            message.channel.send("Não há nenhuma faixa tocando no momento.")
            trava_pl_l = 0
        }
    }else
        message.channel.send(`:name_badge: ${message.author} um momento, estou processando a playlist ainda.`)

    playlists.set(id_canal, queue_local)
    nome_faixas.set(id_canal, queue_faixas)
    trava_pl.set(id_canal, trava_pl_l)
}