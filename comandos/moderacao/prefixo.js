module.exports = {
    name: "prefixo",
    description: "alterar o prefixo do alonsal",
    cooldown: 5,
    aliases: [ "setprefix", "prefix", "px" ],
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { moderacao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        if(args.length !== 1)
            message.reply(moderacao[5]["error_1"] +" `+px`");
        
        client.prefixManager.setPrefix(message.guild.id, args[0])
        message.reply(moderacao[5]["att_prefix"] +" `"+ args[0] +"`");
    }
};