module.exports = {
    name: "ban",
    description: "expulsa ou bane algum usuário do servidor",
    aliases: [ "kick" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const permissions_user = await message.guild.members.fetch(message.author);
        const permissions_bot = await message.guild.members.fetch(message.client.user.id);
        
        if(!permissions_user.permissions.has('KICK_MEMBERS') || !permissions_user.permissions.has('BAN_MEMBERS'))
            return message.reply(`:octagonal_sign: | ${moderacao[4]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));

        if(!permissions_bot.permissions.has('KICK_MEMBERS') || !permissions_bot.permissions.has('BAN_MEMBERS'))
            return message.reply(`:octagonal_sign: | ${moderacao[4]["permissao_2"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
        
        const emoji_ban = client.emojis.cache.get("901560597307613214").toString();
        let id_alvo = message.mentions.members.first();
        
        if(typeof id_alvo === "undefined")
            id_alvo = args[0].toString();

        let alvo = await message.guild.members.fetch(id_alvo)
        .then(() => {
            if(!alvo) return message.reply(moderacao[4]["user_id"]);

            if(alvo.permissions.has('BAN_MEMBERS') || alvo.permissions.has('KICK_MEMBERS'))
                return message.reply(moderacao[4]["error_1"]);

            if(!alvo) return message.reply(`:hotsprings: | ${moderacao[4]["error_2"]}`).then(msg => setTimeout(() => msg.delete(), 3000));

            let banReason = args.join(" ").slice(22);
            if(!banReason)
                banReason = moderacao[4]["razao"];

            // Banindo ou expulsando
            if(message.content.includes("ban"))
                alvo.ban({reason: banReason})
                .then(() => { message.reply(`${emoji_ban} | ${alvo} ${moderacao[4]["banido"]}`); })
                .catch(() => {
                    return message.reply(`:sos: | ${moderacao[4]["error_ban"]}`);
                });
            else
                alvo.kick({reason: banReason})
                .then(() => { message.reply(`${alvo}${moderacao[4]["banido"]}`); })
                .catch(() => {
                    return message.reply(`:sos: | ${moderacao[4]["error_kick"]}`);
                });
        })
        .catch(() => {
            return message.reply(moderacao[4]["user_id"]);
        });
    }
}