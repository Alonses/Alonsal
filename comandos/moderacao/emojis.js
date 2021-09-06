module.exports = {
    name: "Emojis",
    description: "Adicione e remova emojis",
    aliases: [ "moji", "ddmoji", "ddemoji", "rmoji", "removemoji", "dicionaremoji" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { moderacao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        const fetch = require('node-fetch');
        const { MessageEmbed } = require('discord.js');
        const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        
        if(message.content.includes(".amoji")){
            if(typeof args[0] !== "undefined"){
                let match = /<(a?):(.+):(\d+)>/u.exec(message.content);

                if(!match){
                    message.lineReply(":octagonal_sign: | "+ moderacao[2]["aviso_1"]);
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
                message.lineReply( moderacao[2]["aviso_2"] +" `.amoji `"+ emoji_dancando +"` `");
            
            return;
        }

        if(!message.member.hasPermission('MANAGE_EMOJIS')){
            message.lineReply(":octagonal_sign: | "+ moderacao[2]["permissao_1"]);
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
                        return message.lineReply(":octagonal_sign: | "+ moderacao[2]["aviso_1"]);

                    if(args.length < 2 && !message.content.includes("https://cdn.discordapp.com/emojis")){
                        message.lineReply(":warning: | "+ moderacao[2]["aviso_3"] +" `.addemoji `"+ emoji_dancando +"` "+ moderacao[2]["requebrando"] +"`");
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
                        message.lineReply(":octagonal_sign: | "+ moderacao[2]["aviso_4"]);
                        return;
                    }

                    await message.attachments.forEach(attachment => {
                        url = attachment.url;

                        if(attachment.size > 260000){
                            message.lineReply(":octagonal_sign: | "+ moderacao[2]["aviso_5"]);
                            return;
                        }

                        if(!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg") && !url.includes(".bmp") && !url.includes(".gif")){
                            message.lineReply(":warning: | "+ moderacao[2]["error_1"]);
                            return;
                        }

                        nome_emoji = args[0];
                    });
                }
                
                if(nome_emoji != null && url != null){ // Criando o emoji no servidor
                    message.guild.emojis.create(url, nome_emoji)
                    .then(newEmoji => {
                        novo_emoji = client.emojis.cache.get(newEmoji.id).toString();
                        
                        message.lineReply(novo_emoji +" | "+ moderacao[2]["sucesso_1"]);
                    })
                    .catch(err => {
                        message.lineReply(":octagonal_sign: | "+ moderacao[2]["error_2"]);
                    });
                }
            }
            
            // Remover emojis
            if(message.content.startsWith(".armoji") || message.content.startsWith(".aremovemoji")){
                if(args.length < 1){
                    message.lineReply(":warning: | "+ moderacao[2]["aviso_6"] +" `.armoji `"+ emoji_nao_encontrado +"` `");
                    return;
                }

                if(!match){ // Confirma que a entrada é um emoji
                    message.lineReply(":octagonal_sign: | "+ moderacao[2]["aviso_7"]);
                    return;
                }

                // Coletando o emoji do cache do bot
                emoji = client.emojis.cache.get(match[3]);
                
                if(typeof emoji == "undefined" || message.guild.id != emoji.guild.id){
                    message.lineReply(":warning: | "+ moderacao[2]["aviso_8"]);
                    return;
                }
                
                emoji.delete()
                .then(() => {
                    message.lineReply(":wastebasket: | "+ moderacao[2]["sucesso_2"]);
                })
                .catch(err => {
                    message.lineReply(":octagonal_sign: | "+ moderacao[2]["error_3"]);
                });
            }
        }else
            message.lineReply(":octagonal_sign: | "+ moderacao[2]["permissao_2"] +" \':(");
    }
};