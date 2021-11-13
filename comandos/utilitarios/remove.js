module.exports = {
    name: "remove",
    description: "remove o caractere informado",
    aliases: [ "rm" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        if(args.length < 2) return message.reply("Entre com algo para ser removido e uma string\nPor exemplo `.arm o slondo`");

        let string = args.join(" ");

        message.reply(string.replaceAll(args[0].toString(), ""));
    }
}