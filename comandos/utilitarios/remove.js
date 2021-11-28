module.exports = {
    name: "remove",
    description: "remove ou altera o caractere informado",
    aliases: [ "rm", "rp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        if(args.length < 2) return message.reply(utilitarios[7]["aviso_1"]);
        
        let substituto = "";
        let substituir = args[0].toString();

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        if(message.content.startsWith(`${prefix}rp`)){ // Substituindo caracteres
            substituto = args[1].toString();
            args.shift();
        }

        args.shift();
        let string = args.join(" ");

        string = string.replaceAll(substituir, substituto);
        string = string.replace(/\s+/g, ' '); // Apaga espaços extras no meio do texto

        if(string.replaceAll(" ", "").length === 0)
            string = `fix\n${utilitarios[7]["remove_tudo"]}`;
        
        message.reply(`\`\`\`${string}\`\`\``);
    }
}