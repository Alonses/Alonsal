module.exports = {
    name: "sans",
    description: "EsCrEvA DeSsA FoRmA RaPidÃo",
    aliases: [ "" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);

        if(args.length < 1) return message.reply(diversao[7]["aviso_1"].replace(".a", prefix));
        let texto = args.join(" ").split("");
        
        for(let i = 0; i < texto.length; i++)
            if(i % 2 === 0 && i % 1 === 0)
                texto[i] = texto[i].toLocaleUpperCase();
            else
                texto[i] = texto[i].toLocaleLowerCase();

        message.reply(`\`\`\`${texto.join("").slice(0, 1990)}\`\`\``);
    }
}