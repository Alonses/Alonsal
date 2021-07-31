module.exports = {
    name: "Emojis",
    description: "Adicione e remova emojis",
    aliases: [ "moji", "ddemoji", "rmoji", "removemoji", "dicionaremoji" ],
    cooldown: 3,
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
                        url = "https://cdn.discordapp.com/emojis/"+ match[3] + ".png";

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

        if(message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') && message.guild.me.permissions.has('MANAGE_EMOJIS')){ // Verificar permissões do bot  

            let match = /<(a?):(.+):(\d+)>/u.exec(message.content);
            if (!match && args.length > 0)
            return message.lineReply(":octagonal_sign: | Inclua um emoji customizado em seu comando! :P");

            if(message.content.startsWith(".addemoji") || message.content.startsWith(".adicionaremoji")){
                
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
                
                message.guild.emojis.create(url, args[1]).then(newEmoji => {
                    novo_emoji = client.emojis.cache.get(newEmoji.id).toString();

                    message.lineReply(`${novo_emoji} | O Emoji foi adicionado!`);
                });
            }
            
            // Remover emojis
            if(message.content.startsWith(".armoji") || message.content.startsWith(".aremovemoji")){
                if(args.length < 1){
                    message.lineReply(":warning: | Inclua o emoji para remover\nPor exemplo, `.armoji `"+ emoji_nao_encontrado +"` `");
                    return;
                }

                try{
                    emoji = client.emojis.cache.get(match[3]).toString();
                }catch(err){
                    message.lineReply(":warning: | Informe um emoji customizado deste servidor para ser removido");
                    return;
                }

                const emoji_alvo = client.emojis.cache.find(emoji => emoji.name === match[2]);

                emoji_alvo.delete().then(() => {
                    message.lineReply(`:wastebasket: | O Emoji foi removido do servidor`);
                });
                
            }
        }else
            message.lineReply(":octagonal_sign: | Eu não possuo permissões para gerenciar emojis neste servidor \':(");
    }
};