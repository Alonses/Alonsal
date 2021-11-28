module.exports = {
    name: "remove",
    description: "remove ou altera o caractere informado",
    aliases: [ "rm", "rp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){

        let alvo = "";
        let substituir = args[0].toString();

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        if(args.length < 2) return message.reply("Entre com algo para ser removido ou substituído e uma string\nPor exemplo `.arm o slondo` ou `.arp i o slindo`");

        if(message.content.startsWith(`${prefix}rp`)){ // Substituindo caracteres
            alvo = args[1].toString();
            args.shift();
        }

        args.shift();
        let string = args.join(" ");

        message.reply(`\`\`\`${string.replaceAll(substituir, alvo)}\`\`\``);
    }
}