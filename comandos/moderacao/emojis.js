module.exports = {
    name: "Emojis",
    description: "Adicione e remova emojis",
    aliases: [ "moji", "ddmoji", "ddemoji", "rmoji", "removemoji", "dicionaremoji" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const fetch = require('node-fetch');
        const { MessageEmbed } = require('discord.js');
        const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        
        if(message.content.includes(".amoji")){
            if(typeof args[0] !== "undefined"){
                let match = /<(a?):(.+):(\d+)>/u.exec(message.content);

                if(!match){
                    message.lineReply(":octagonal_sign: | Inclua um emoji customizado em seu comando! :P");
                    return;
                }
                
                let url = "https://cdn.discordapp.com/emojis/"+ match[3] + ".gif";

                fetch(url) // Busca pelo emoji em formato de gif
                .then(async res => {

                    if(res.status != 200) // Emoji externo não é animado // URL não existe
                        url = url.replace(".gif", ".png");

                    const embed = new MessageEmbed()
                    .setTitle(':mag: Emoji '+ match[2])
                    .setColor(0x29BB8E)
                    .setURL(url)
                    .setImage(url);
    
                    message.lineReply(embed);
                });
            }else
                message.lineReply("Informe um emoji para ser visualizado\nPor exemplo, `.amoji `"+ emoji_dancando +"` `");
            
            return;
        }

        if(!message.member.hasPermission('MANAGE_EMOJIS')){
            message.lineReply(":octagonal_sign: | Você não possui permissões para gerenciar emojis neste servidor");
            return;
        }
        
        // Verificar permissões do bot
        if(message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') && message.guild.me.permissions.has('MANAGE_EMOJIS')){  

            let match = /<(a?):(.+):(\d+)>/u.exec(message.content);
            let nome_emoji = null;
            let url = null;
            
            if(message.content.startsWith(".addemoji") || message.content.startsWith(".adicionaremoji")){

                if(message.attachments.size < 1){

                    if(!match && args.length > 0 && !message.content.includes("https://cdn.discordapp.com/emojis"))
                        return message.lineReply(":octagonal_sign: | Inclua um emoji customizado em seu comando! :P");

                    if(args.length < 2 && !message.content.includes("https://cdn.discordapp.com/emojis")){
                        message.lineReply(":warning: | Insira um emoji e o nome dele\nPor exemplo, `.addemoji `"+ emoji_dancando +"` requebrando`");
                        return;
                    }

                    if(!message.content.includes("https://cdn.discordapp.com/emojis/")){
                        match[2] = args[1]; // altera com o novo nome
    
                        // animated will be 'a' if it is animated or '' if it isn't
                        const [, animated, name, id] = match;
                        url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png' }`;
                        
                    }else
                        url = args[0];

                    nome_emoji = args[1];
                }else{

                    if(message.attachments.size > 1){
                        message.lineReply(":octagonal_sign: | Envie apenas 1 emoji por vez :P");
                        return;
                    }

                    await message.attachments.forEach(attachment => {
                        url = attachment.url;

                        if(attachment.size > 260000){
                            message.lineReply(":octagonal_sign: | Envie uma imagem com tamanho menor que 250kb para usar de emoji");
                            return;
                        }

                        if(!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg") && !url.includes(".bmp") && !url.includes(".gif")){
                            message.lineReply(':warning: | Não é possível processar este arquivo\nEnvie um arquivo de imagem para eu poder manipular ;)');
                            return;
                        }

                        nome_emoji = args[0];
                    });
                }
                
                if(nome_emoji != null && url != null){ // Criando o emoji no servidor
                    message.guild.emojis.create(url, nome_emoji)
                    .then(newEmoji => {
                        novo_emoji = client.emojis.cache.get(newEmoji.id).toString();
                        
                        message.lineReply(`${novo_emoji} | O Emoji foi adicionado!`);
                    })
                    .catch(err => {
                        message.lineReply(":octagonal_sign: | O Limite de emojis para este servidor foi atingido, remova alguns antes de adicionar novos");
                    });
                }
            }
            
            // Remover emojis
            if(message.content.startsWith(".armoji") || message.content.startsWith(".aremovemoji")){
                if(args.length < 1){
                    message.lineReply(":warning: | Inclua o emoji para remover\nPor exemplo, `.armoji `"+ emoji_nao_encontrado +"` `");
                    return;
                }

                if(!match){ // Confirma que a entrada é um emoji
                    message.lineReply(":octagonal_sign: | Informe um emoji para ser removido");
                    return;
                }

                // Coletando o emoji do cache do bot
                emoji = client.emojis.cache.get(match[3]);
                
                if(typeof emoji == "undefined" || message.guild.id != emoji.guild.id){
                    message.lineReply(':warning: | Informe um emoji customizado deste servidor para ser removido');
                    return;
                }
                
                emoji.delete()
                .then(() => {
                    message.lineReply(':wastebasket: | O Emoji foi removido do servidor');
                })
                .catch(err => {
                    message.lineReply(':octagonal_sign: | Não foi possível remover este emoji, tente novamente');
                });
            }
        }else
            message.lineReply(":octagonal_sign: | Eu não possuo permissões para `gerenciar emojis` neste servidor \':(");
    }
};