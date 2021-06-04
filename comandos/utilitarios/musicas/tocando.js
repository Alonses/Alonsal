const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const getThumb = require('video-thumbnail-url');

module.exports = async function({message, playlists}){
    
    queue_local = playlists.get(id_canal)
    dados_np = await ytdl.getInfo(queue_local[0]).then(info => info.videoDetails);
    
    thumb = await getThumb(queue_local[0]).then(thumb_url => {
        return thumb_url;   
    });

    titulo = dados_np.title
    descricao = dados_np.description

    if(descricao == null)
        descricao = "Sem descrição";
        
    const embed_np = new Discord.MessageEmbed()
        .setTitle('Tocando agora :notes:')
        .setColor('#29BB8E')
        .setThumbnail(thumb)
        .setDescription("-----------------------------\n**"+ titulo +"**\nLink: "+ queue_local[0] +"\n\n"+ dados_np.description);
    
    await message.channel.send(embed_np)
}