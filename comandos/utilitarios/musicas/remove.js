const ytdl = require('ytdl-core')

module.exports = async ({message, args, playlists, nome_faixas, id_canal}) => {

    if(typeof playlists != "undefined"){

        if(args.length < 1){
            message.channel.send(":octagonal_sign: Informe o número de uma faixa para remover, utilize o `.aspl` para ver sua playlist.")
            return
        }

        queue_local = playlists.get(id_canal)
        nome_faixas_l = nome_faixas.get(id_canal)

        if(args[0] !== 1){

            if(args[0] === "all"){
                let faixa_atual = queue_local[0];
                let nome_faixa = nome_faixas_l[0];

                queue_local = [];
                nome_faixas_l = [];

                queue_local.push(faixa_atual);
                nome_faixas_l.push(nome_faixa);

                message.channel.send(`:wastebasket: ${message.author} todas as próximas faixas foram removidas.`);
            }else{
                // Removendo a faixa informada do array
                link_removido = queue_local.splice(args[0] - 1, 1)

                if(typeof nome_faixas_l != "undefined")
                    faixa_removida = nome_faixas_l.splice(args[0] - 1, 1)
                else
                    faixa_removida = await ytdl.getInfo(link_removido).then(info => info.videoDetails.title);

                message.channel.send(":wastebasket: A faixa [ `"+ faixa_removida +"` ] foi removida da playlist.")
            }
        }else{
            message.channel.send(`${message.author}` + "Use `.assk` para pular a faixa atual antes de remover ela")
            return
        }

        await playlists.set(id_canal, queue_local)
        await nome_faixas.set(id_canal, nome_faixas_l)
    }
}