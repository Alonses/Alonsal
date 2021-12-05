module.exports = {
    name: "remove",
    description: "remove ou altera o caractere informado",
    aliases: [ "rm", "rp", "replace", "remover", "substituir" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        if(args.length < 2) return message.reply(utilitarios[7]["aviso_1"]);
        
        let substituto = "";
        let substituir = args[0].raw;

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        if(message.content.startsWith(`${prefix}rp`) || message.content.startsWith(`${prefix}replace`) || message.content.startsWith(`${prefix}substituir`)){ // Substituindo caracteres
            substituto = args[1].raw;
            args.shift();
        }

        args.shift();
        let string = args.join(" ");

        string = string.replaceAll(substituir, substituto).replace(/\s+/g, ' ');

        if(string.replaceAll(" ", "").length === 0)
            string = `fix\n${utilitarios[7]["remove_tudo"]}`;
        
        message.reply(`\`\`\`${string}\`\`\``);
    }
}