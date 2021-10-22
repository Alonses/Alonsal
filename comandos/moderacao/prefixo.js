module.exports = {
    name: "prefixo",
    description: "alterar o prefixo do alonsal",
    cooldown: 5,
    aliases: [ "setprefix", "prefix", "px" ],
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { moderacao } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');
        
        if(!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== "665002572926681128") return message.reply(moderacao[5]["moderadores"]); // Libera configuração para o Slondo e adms apenas

        if(args.length !== 1)
            message.reply(moderacao[5]["error_1"] +" `+px`");
        
        client.prefixManager.setPrefix(message.guild.id, args[0])
        message.reply(moderacao[5]["att_prefix"] +" `"+ args[0] +"`");

        client.channels.cache.get('872865396200452127').send(":asterisk: | Prefixo do servidor ( `"+ message.guild.name +"` | `"+ message.guild.id +"` ) alterado para : `"+ args[0] +"`");
    }
};