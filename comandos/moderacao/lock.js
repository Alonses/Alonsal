module.exports = {
    name: "Travar",
    description: "Trava ou destrava um canal do servidor",
    aliases: [ "lk", "unlk", "unlock", "destravar", "liberar" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {

        const { Permissions } = require('discord.js');

        const permissions_bot = message.channel.permissionsFor(client.user);
        const { moderacao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');
        let trava_canal = false;
        let msg_retorno = `:lock: | Canal **${message.channel.name}** bloqueado\nUtilize \`.aunlk\` para desbloquear`;

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        if(!permissions_bot.has("MANAGE_CHANNEL"))
            return message.reply("Eu não posso configurar este canal, eu preciso da permissão `Gerenciar Canais` para isto");
        
        if(message.content === prefix +"unlk" || message.content === prefix +"unlock" || message.content === prefix +"destravar" || message.content === prefix +"liberar"){
            trava_canal = true;
            msg_retorno = `:unlock: | Canal **${message.channel.name}** desbloqueado\nUtilize \`.alock\` para bloquear`
            
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

        message.reply(msg_retorno);
    }
}