const CryptoJS = require("crypto-js");

module.exports = {
    name: "crypto",
    description: "Criptografia",
    aliases: [ "cr", "dr", "cripto" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        let prefix = client.prefixManager.getPrefix(message.guild.id);
        
        if(args.length < 2)
            return message.reply(utilitarios[11]["aviso_1"].replaceAll(".a", prefix));

        let resultado;

        if(args.length > 2){
            let texto = args.join(" ");
            texto = texto.replace(args[0], "");
            
            resultado = `${utilitarios[11]["chave"]}: \`${args[0]}\` :: ${CryptoJS.AES.encrypt(texto, args[0]).toString()}`;
        }else if(args.length === 2){
            let bytes = CryptoJS.AES.decrypt(args[1], args[0]);
            resultado = bytes.toString(CryptoJS.enc.Utf8);
        }

        if(resultado === "")
            resultado = utilitarios[11]["error_1"];

        await message.reply(`:hotsprings: | ${resultado}`)
        .then(msg => setTimeout(() => msg.delete(), 10000));

        setTimeout(() => {
            const permissions = message.channel.permissionsFor(message.client.user);
        
            if(permissions.has("MANAGE_MESSAGES"))
                message.delete();
        }, 500);
    }
}