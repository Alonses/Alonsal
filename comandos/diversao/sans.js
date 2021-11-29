module.exports = {
    name: "sans",
    description: "EsCrEvA DeSsA FoRmA RaPidÃo",
    aliases: [ "" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        if(args.length < 1) return message.reply("Escreva algo");
        let texto = args.join(" ").split("");
        
        for(let i = 0; i < texto.length; i++)
            if(i % 2 === 0 && i % 1 === 0)
                texto[i] = texto[i].toLocaleUpperCase();

        message.reply(texto.join(""));
    }
}