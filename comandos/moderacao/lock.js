const { Permissions } = require('discord.js');

module.exports = {
    name: "Travar",
    description: "Trava ou destrava um canal do servidor",
    aliases: [ "lock", "lok", "lk", "unlk", "unlock", "destravar", "liberar" ],
    cooldown: 3,    
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { moderacao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');
        const permissions_user = message.channel.permissionsFor(message.author);
        const permissions_bot = message.channel.permissionsFor(message.client.user);

        if(!permissions_user.has("MANAGE_CHANNEL"))
            return message.reply(':octagonal_sign: | '+moderacao[7]["permissao_1"]).then(msg => setTimeout(() => msg.delete(), 5000));

        if(!permissions_bot.has("MANAGE_CHANNEL"))
            return message.reply(':octagonal_sign: | '+moderacao[7]["permissao_2"]).then(msg => setTimeout(() => msg.delete(), 5000));

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        let trava_canal = false;
        let msg_retorno = `:lock: | `+ moderacao[7]["canal"] +` **${message.channel.name}** `+ moderacao[7]["lock"].replaceAll(".a", prefix);
        
        if(message.content === prefix +"unlk" || message.content === prefix +"unlock" || message.content === prefix +"destravar" || message.content === prefix +"liberar"){
            trava_canal = true;
            msg_retorno = `:unlock: | `+ moderacao[7]["canal"] +` **${message.channel.name}** `+ moderacao[7]["unlock"].replaceAll(".a", prefix);
            
            message.channel.permissionOverwrites.set([
                {
                    id: message.guild.id,
                    allow: [Permissions.FLAGS.SEND_MESSAGES]
                }
            ]);
        }else{
            message.channel.permissionOverwrites.set([
                {
                    id: message.guild.id,
                    deny: [Permissions.FLAGS.SEND_MESSAGES]
                },
                {
                    id: client.user.id,
                    allow: [Permissions.FLAGS.SEND_MESSAGES]
                }
            ]);
        }

        await message.reply(msg_retorno);

        if(message.content === ".alok")
            message.channel.send("https://tenor.com/view/alok-dj-cup-drink-cap-gif-17175137");
    }
}