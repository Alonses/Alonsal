module.exports = {
    name: "avatar",
    description: "mostra o avatar de um usuário",
    aliases: [ "vatar", "perfil" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const fetch = require('node-fetch');

        const { MessageEmbed } = require("discord.js");
        const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');
        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if(!isNaN(args[0])){ // Coleta por ID numérico no chat
            try{
                user = message.guild.members.cache.get(args[0]).user;
            }catch(err){ // Usuário não encontrado
                return message.lineReply(emoji_nao_encontrado + " | "+ utilitarios[4]["nao_conhecido"]);
            }
        }else
            user = message.mentions.users.first() || message.author;

        let avatar = user.displayAvatarURL({ size: 2048 }); 
        
        url = 'https://cdn.discordapp.com/avatars/'+ user.id +'/'+ user.avatar +'.gif?size=512';
        avatar = url;

        fetch(url)
        .then(res => {
            
            if(res.status != 200)
                avatar = avatar.replace('.gif', '.webp')

            const embed = new MessageEmbed()
            .setTitle(':bust_in_silhouette: Baixar o avatar')
            .setURL(avatar)
            .setColor(0x29BB8E)
            .setImage(avatar);
            
            message.lineReply(embed);
        });
    }
};