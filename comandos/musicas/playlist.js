const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = async ({client, message, playlists, nome_faixas, repeteco, trava_pl}) => {

    let Vchannel = message.member.voice.channel;
    let id_canal = Vchannel.id;
    
    if(typeof playlists.get(id_canal) != "undefined")
        queue_local = playlists.get(id_canal)
    else{
        message.channel.send("Não há faixas na playlist, adicione algumas para poder acessar este comando")
        return
    }

    queue_faixas = nome_faixas.get(id_canal)
    repeteco_ = repeteco.get(id_canal)
    trava_pl_l = trava_pl.get(id_canal)
    
    if(typeof queue_faixas === "undefined")
        queue_faixas = []

    if(typeof trava_pl_l === "undefined")
        trava_pl_l = 0

    if(trava_pl_l === 0){
        trava_pl.set(id_canal, 1)
        
        let carregando_pl = client.emojis.cache.get(emojis.carregando).toString();

        if(queue_local.length > 0){
            const m = await message.channel.send(carregando_pl +" Ordenando as músicas da playlist, aguarde um pouco :P "+ carregando_pl);

            let faixas_demonst = "";

            if(queue_local.length > 1)
                faixas_demonst = "\n-----------------------------\n\n> **Próximas** :floppy_disk: ";
            
            if(repeteco_ === 1)
                faixas_demonst += "[ :repeat: O Repeteco está ativo ]\n";
            else
                faixas_demonst += "\n";
            
            // Controla a posicao que irá começar a buscar novamente
            let indice_seg = 0;
            
            while(queue_faixas.length > queue_local.length){
                queue_faixas.shift();
            }

            if(queue_faixas.length > 0)
                indice_seg = queue_faixas.length;

            for(let faixa_in = indice_seg; faixa_in < queue_local.length; faixa_in++){
                if(typeof queue_local[faixa_in] !== "undefined"){
                    try{
                        if(queue_faixas.length != queue_local.length){
                            faixas_ = await ytdl.getInfo(queue_local[faixa_in]).then(info => info.videoDetails.title);

                            if(!queue_faixas.includes(faixas_));
                                queue_faixas.push(faixas_);
                        }
                    }catch(err){
                        message.channel.send(":octagonal_sign: Erro ao buscar informações do vídeo [ `"+ queue_local[faixa_in] +"` ]");
                        return
                    }
                }
            }

            for(let tfp = 1; tfp < queue_faixas.length; tfp++){
                faixas_demonst += "**`"+ (tfp + 1) +"`** - **`" + queue_faixas[tfp] + "`**\n";
            }

            const embed = new Discord.MessageEmbed()
            .setTitle(':radio: Playlist atual de '+ message.guild.name)
            .setColor(0x29BB8E)
            .setThumbnail('https://images-ext-1.discordapp.net/external/3IKYR-a4akS8XRmEhkD8hQK0JaXcKatEckJm1gaVaJc/https/i.gifer.com/ZTOH.gif')
            .setDescription("> **Tocando agora** :notes:\n **`1`** - [ **`"+ queue_faixas[0] +"`** ]"+ faixas_demonst)
            .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }))
            .setTimestamp();
            
            m.edit(`:page_with_curl: Tudo certo ${message.author}, a playlist está abaixo //`, embed);

            trava_pl_l = 0
        }else{
            message.channel.send(":free: Não há nenhuma faixa tocando no momento.")
            trava_pl_l = 0
        }
    }else
        message.channel.send(`:name_badge: ${message.author} um momento, estou processando a playlist ainda.`)

    await playlists.set(id_canal, queue_local)
    await nome_faixas.set(id_canal, queue_faixas)
    await trava_pl.set(id_canal, trava_pl_l)
}