const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const getThumb = require('video-thumbnail-url');

module.exports = async function({message, playlists, id_canal}){
    
    queue_local = playlists.get(id_canal)
    dados_np = await ytdl.getInfo(queue_local[0]).then(info => info.videoDetails);
    
    thumb = await getThumb(queue_local[0]).then(thumb_url => {
        return thumb_url;   
    });

    titulo = dados_np.title
    descricao = dados_np.description
    segundos = dados_np.lengthSeconds

    segundos = dados_np.lengthSeconds
    tempo = new Date(segundos * 1000).toISOString().substr(11, 8)

    tempo_c = tempo.split(":")
    if(tempo_c[0] == "00")
        tempo = tempo.replace("00:", "")

    // Limitar o tamanho da descricao
    trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
    descricao = trimString(descricao, 90)

    if(descricao == null)
        descricao = "Vídeo sem descrição :books:";
    
    const embed_np = new Discord.MessageEmbed()
        .setTitle('Tocando agora :notes:')
        .setColor('#29BB8E')
        .setThumbnail(thumb)
        .setDescription("-----------------------------\n**"+ titulo +"**\nLink: "+ queue_local[0] +"\n\n"+ descricao + "\n\n**Duração: `"+ tempo +"`**")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }))
        .setTimestamp();
    
    message.channel.send(embed_np)
}