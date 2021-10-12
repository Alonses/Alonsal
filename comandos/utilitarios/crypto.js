module.exports = {
    name: "crypto",
    description: "Criptografia",
    aliases: [ "cr", "dr" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const CryptoJS = require("crypto-js");
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);
            
        if(args.length < 2)
            return message.reply(utilitarios[11]["aviso_1"].replaceAll(".a", prefix));

        let texto = "";
        let resultado = "";

        if(args.length > 2){
            for(let i = 1; i < args.length; i++){
                texto += args[i];

                if(typeof args[i+1] !== "undefined")
                    texto += " ";
            }

            resultado = utilitarios[11]["chave"] +": `"+ args[0] +"` :: "+ CryptoJS.AES.encrypt(texto, args[0]).toString();
        }else if(args.length === 2){
            let bytes = CryptoJS.AES.decrypt(args[1], args[0]);
            resultado = bytes.toString(CryptoJS.enc.Utf8);
        }

        if(resultado === "")
            resultado = utilitarios[11]["error_1"];

        await message.reply(":hotsprings: | "+ resultado).then(msg => {
            setTimeout(() => msg.delete(), 10000);
        });

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES"))
            message.delete();
    }
}