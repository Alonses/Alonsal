module.exports = {
    name: "Travar",
    description: "Trava ou destrava um canal do servidor",
    aliases: [ "lock", "lok", "lk", "unlk", "unlock", "destravar", "liberar" ],
    cooldown: 3,    
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {

        const { Permissions } = require('discord.js');

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        const permissions_bot = message.channel.permissionsFor(client.user);
        const { moderacao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');
        let trava_canal = false;
        let msg_retorno = `:lock: | `+ moderacao[7]["canal"] +` **${message.channel.name}** `+ moderacao[7]["lock"].replaceAll(".a", prefix);

        if(!permissions_bot.has("MANAGE_CHANNEL"))
            return message.reply(moderacao[7]["permissao"]);
        
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