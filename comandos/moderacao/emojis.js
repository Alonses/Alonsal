const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "Emojis",
    description: "Adicione e remova emojis",
    aliases: [ "addemoji", "addmoji", "moji", "ddmoji", "ddemoji", "rmoji", "removemoji", "dicionaremoji" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
        let prefix = client.prefixManager.getPrefix(message.guild.id);

        if(message.content.includes(`${prefix}moji`)){
            if(typeof args[0] !== "undefined"){
                let match = /<(a?):(.+):(\d+)>/u.exec(message.content);

                if(!match) // Padrão de emoji incorreto
                    return message.reply(`:octagonal_sign: | ${moderacao[2]["aviso_1"]}`);
                
                let url = `https://cdn.discordapp.com/emojis/${match[3]}.gif`;

                fetch(url) // Busca pelo emoji em formato de gif
                .then(async res => {

                    if(res.status !== 200) // Emoji externo não é animado // URL não existe
                        url = url.replace(".gif", ".png");
                    
                    let imagem_emoji = new MessageAttachment(url);

                    message.reply({ files: [imagem_emoji] });
                });
            }else
                message.reply(`${moderacao[2]["aviso_2"]} \`${prefix}moji \`${emoji_dancando}\` \``);
            
            return;
        }

        if(!message.member.permissions.has('MANAGE_EMOJIS_AND_STICKERS')) // Permissão do membro para gerenciar emojis
            return message.reply(`:octagonal_sign: | ${moderacao[2]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
        
        // Verificar permissões do bot
        if(message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS') && message.guild.me.permissions.has('MANAGE_EMOJIS_AND_STICKERS')){

            let match = /<(a?):(.+):(\d+)>/u.exec(message.content);
            let nome_emoji = null;
            let url = null;
            
            if(message.content.startsWith(`${prefix}ddemoji`) || message.content.startsWith(`${prefix}dicionaremoji`) || message.content.startsWith(`${prefix}ddmoji`)){

                if(message.attachments.size < 1){

                    if(!match && args.length > 0 && !message.content.includes("https://cdn.discordapp.com/emojis")) // Mais que um emoji, padrão incorreto ou link incorreto
                        return message.reply(`:octagonal_sign: | ${moderacao[2]["aviso_1"]}`);

                    if(args.length < 2 && !message.content.includes("https://cdn.discordapp.com/emojis")) // Apenas um emoji e link de emoji
                        return message.reply(`:warning: | ${moderacao[2]["aviso_3"]} \`${prefix}ddemoji \`${emoji_dancando}\` ${moderacao[2]["requebrando"]}\``);

                    if(!message.content.includes("https://cdn.discordapp.com/emojis/")){
                        match[2] = args[1]; // altera com o novo nome

                        const [, animated, name, id] = match;
                        url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png' }`;
                        
                    }else
                        url = args[0].raw;

                    nome_emoji = args[1].raw;
                }else{

                    if(message.attachments.size > 1) // Mais de um arquivo enviado
                        return message.reply(`:octagonal_sign: | ${moderacao[2]["aviso_4"]}`);

                    await message.attachments.forEach(attachment => {
                        url = attachment.url;

                        if(attachment.size > 260000) // Tamanho do arquivo maior que 250kb
                            return message.reply(`:octagonal_sign: | ${moderacao[2]["aviso_5"]}`);

                        if(!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg") && !url.includes(".bmp") && !url.includes(".gif")) // Extensão do arquivo incorreta
                            return message.reply(`:warning: | ${moderacao[2]["error_1"]}`);

                        nome_emoji = args[0].raw;
                    });
                }
                
                if(nome_emoji != null && url != null){ // Criando o emoji no servidor
                    message.guild.emojis.create(url, nome_emoji)
                    .then(newEmoji => {
                        const novo_emoji = client.emojis.cache.get(newEmoji.id).toString();
                        
                        message.reply(`${novo_emoji} | ${moderacao[2]["sucesso_1"]}`);
                    })
                    .catch(err => {
                        console.log(err);
                        message.reply(`:octagonal_sign: | ${moderacao[2]["error_2"]}`);
                    });
                }
            }
            
            // Remover emojis
            if(message.content.startsWith(`${prefix}rmoji`) || message.content.startsWith(`${prefix}removemoji`)){
                if(args.length < 1) // Argumentos insuficientes
                    return message.reply(`:warning: | ${moderacao[2]["aviso_6"]} \`${prefix}rmoji \`${emoji_nao_encontrado}\` \``);

                if(!match) // Confirma que a entrada é um emoji
                    if(isNaN(Number(args[0].value)))
                        return message.reply(`:octagonal_sign: | ${moderacao[2]["aviso_7"]}`);

                // Coletando o emoji do cache do bot
                if(isNaN(Number(args[0].value))){
                    emoji = await client.emojis.cache.get(match[3]);
                    console.log(match[3], typeof match[3]);
                }else
                    emoji = await client.emojis.cache.get(args[0].raw);

                if(typeof emoji === "undefined" || message.guild.id !== emoji.guild.id) // Emoji indefinido ou emoji pertencente ao servidor o qual o comando foi acionado
                    return message.reply(`:warning: | ${moderacao[2]["aviso_8"].replace(".a", prefix)}`);
                
                emoji.delete()
                .then(() => {
                    message.reply(`:wastebasket: | ${moderacao[2]["sucesso_2"]}`);
                })
                .catch(() => {
                    message.reply(`:octagonal_sign: | ${moderacao[2]["error_3"]}`);
                });
            }
        }else
            message.reply(`:octagonal_sign: | ${moderacao[2]["permissao_2"]} \':(`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
};