module.exports = {
    name: "ban",
    description: "expulsa ou bane algum usuário do servidor",
    aliases: [ "kick" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
        
        const permissions = message.channel.permissionsFor(message.client.user);

        if(!permissions.has(['KICK_MEMBERS', 'BAN_MEMBERS'])) // Permissão para gerenciar banir e expulsar membros
            return message.lineReply(':octagonal_sign: | ' + moderacao[1]["permissao"]);

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { moderacao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        let alvo = message.guild.member(message.mentions.members.first()) 
        
        if(!alvo){
            if(isNaN(args[0]))
                return message.lineReply(moderacao[4]["user_id"]);

            alvo = await message.guild.members.fetch(args[0]); // Pega o usuário pelo ID
        }

        if(alvo.hasPermission(['BAN_MEMBERS'], ['KICK_MEMBERS']))
            return message.lineReply(moderacao[4]["error_1"]);

        if(!alvo) return message.lineReply(":hotsprings: | "+ moderacao[4]["error_2"]).then(message => message.delete({timeout: 3000}));

        let banReason = args.join(" ").slice(22);
        let dias = banReason.split(" ")[0]; // Dias que ficará banido

        if(!isNaN(dias))
            banReason = banReason.replace(dias, "");
        else
            dias = null;

        if(!banReason)
            banReason = moderacao[4]["razao"];

        // Banindo ou expulsando
        if(message.content.includes("ban"))
            alvo.ban({days: dias, reason: banReason})
            .then(() => { message.lineReply(alvo +""+ moderacao[4]["banido"]); })
            .catch(() => {
                return message.lineReply(moderacao[4]["error_ban"]);
            });
        else
            alvo.kick({reason: banReason})
            .then(() => { message.lineReply(alvo +""+ moderacao[4]["banido"]); })
            .catch(() => {
                return message.lineReply(moderacao[4]["error_kick"]);
            });
    }
}