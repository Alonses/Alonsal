module.exports = {
    name: "avatar",
    description: "mostra o avatar de um usuário",
    aliases: [ "vatar", "perfil" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const fetch = require('node-fetch');

        const { MessageEmbed } = require("discord.js")
        
        const user = message.mentions.users.first() || message.author;
        let avatar = user.displayAvatarURL({ size: 512 }); 
        
        url = 'https://cdn.discordapp.com/avatars/'+ user.id +'/'+ user.avatar +'.gif?size=512';
        avatar = url;

        fetch(url)
        .then(res => {
            
            if(res.status != 200)
                avatar = avatar.replace('.gif', '.webp')

            const embed = new MessageEmbed()
            .setColor(0x29BB8E)
            .setImage(avatar);
            
            message.lineReply(embed);
        });
    }
};