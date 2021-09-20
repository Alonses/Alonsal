module.exports = {
    name: "crypto",
    description: "Criptografia",
    aliases: [ "cr", "dr" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const CryptoJS = require("crypto-js");
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        if(args.length < 2)
            return message.lineReply(utilitarios[11]["aviso_1"]);

        let texto = "";

        if(args.length > 2){
            for(let i = 1; i < args.length; i++){
                texto += args[i];

                if(typeof args[i+1] !== "undefined")
                    texto += " ";
            }

            resultado = utilitarios[11]["chave"] +": `"+ args[0] +"` :: "+ CryptoJS.AES.encrypt(texto, args[0]).toString();
        }else if(args.length == 2){
            let bytes = CryptoJS.AES.decrypt(args[1], args[0]);
            resultado = bytes.toString(CryptoJS.enc.Utf8);
        }

        if(resultado == "")
            resultado = utilitarios[11]["error_1"];

        await message.lineReply(":hotsprings: | "+ resultado).then(message => message.delete({timeout: 10000}));

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES"))
            message.delete();
    }
}