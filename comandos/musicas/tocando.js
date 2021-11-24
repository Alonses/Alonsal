const Discord = require('discord.js');
const ytdl = require('ytdl-core')
const getThumb = require('video-thumbnail-url');

module.exports = async function({client, message, playlists, id_canal}){
    
    const { musicas } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

    queue_local = playlists.get(id_canal);

    if(typeof queue_local !== "undefined"){

        if(typeof queue_local[0] == "undefined"){
            message.reply(":hotsprings: | "+ musicas[3]["aviso_1"]).then(message => message.delete({timeout: 3000}));
            return;
        }

        const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

        let emoji_negativo = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        dados_np = await ytdl.getInfo(queue_local[0]).then(info => info.videoDetails);

        thumb = await getThumb(queue_local[0]).then(thumb_url => {
            return thumb_url;
        });

        titulo = dados_np.title;
        descricao = dados_np.description;
        segundos = dados_np.lengthSeconds;

        segundos = dados_np.lengthSeconds;
        tempo = new Date(segundos * 1000).toISOString().substr(11, 8);

        tempo_c = tempo.split(":");
        if(tempo_c[0] == "00")
            tempo = tempo.replace("00:", "");

        // Limitar o tamanho da descricao
        trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
        
        if(descricao != null)
            descricao = trimString(descricao, 90);
        else
            descricao = musicas[3]["sem_descricao"] +" "+ emoji_negativo;
        
        const embed_np = new Discord.MessageEmbed()
            .setTitle(musicas[3]["tocando"])
            .setColor('#29BB8E')
            .setThumbnail(thumb)
            .setDescription("-----------------------------\n**"+ titulo +"**\nLink: "+ queue_local[0] +"\n\n"+ descricao + "\n\n**"+ musicas[0]["duracao"] +": `"+ tempo +"`**");
        
        message.reply(embed_np);
    }else
        message.reply(":hotsprings: | "+ musicas[3]["aviso_1"]).then(message => message.delete({timeout: 3000}));
}