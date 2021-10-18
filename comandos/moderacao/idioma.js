const fs = require("fs");

module.exports = {
    name: "idioma",
    description: "Veja seu ping local",
    aliases: [ "language", "lang" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        let idioma_padrao = "pt-br"; // O idioma padrão do Alonsal

        if(typeof idioma_servers[message.guild.id] != "undefined")
            idioma_padrao = idioma_servers[message.guild.id];

        const { moderacao } = require('../../arquivos/idiomas/'+ idioma_padrao +'.json');


        if(!message.member.permissions.has('MANAGE_GUILD'))
            return message.reply(":octagonal_sign: | "+ moderacao[3]["permissao_1"]);

        let idioma_selecionado;

        if(args[0] !== "pt" && args[0] !== "en")
            return message.reply(moderacao[0]["error"].replaceAll(".a", prefix));
        else
            idioma_selecionado = "pt-br";

        let outputArray = []; // Transfere todos os dados do JSON para um array

        for (let element in idioma_servers) {
            outputArray.push(constructJson(element, idioma_servers[element]));
        }

        let idioma_alterado = ":flag_br: | Idioma alterado para `Português Brasileiro`";

        if(args[0] === "pt")
            idioma_selecionado = "pt-br";
        else if(args[0] === "en") {
            idioma_selecionado = "en-us";
            idioma_alterado = ":flag_us: | Language switched to `American English`";
        }

        for(let i = 0; i < outputArray.length; i++){ // Procura pelo ID do server e altera o idioma
            let obj = outputArray[i];

            let key = Object.keys(idioma_servers);

            if(key[i] === message.guild.id) {
                obj[message.guild.id] = idioma_selecionado;
                break;
            }
        }

        message.reply(idioma_alterado);

        let idioma_servidor = JSON.stringify(outputArray, null, 5);

        idioma_servidor = idioma_servidor.replace("[", "");
        idioma_servidor = idioma_servidor.replace("]", "");
        idioma_servidor = idioma_servidor.replaceAll("{", "");
        idioma_servidor = idioma_servidor.replaceAll("}", "");
        idioma_servidor = "{ \"idioma_servers\" : {" + idioma_servidor + "} }";

        idioma_servidor = JSON.parse(idioma_servidor); // Ajusta o arquivo
        idioma_servidor = JSON.stringify(idioma_servidor, null, 5);

        fs.writeFile('./arquivos/json/dados/idioma_servers.json', idioma_servidor, (err) => {
            if (err) throw err;
            
            client.channels.cache.get('872865396200452127').send(idioma_alterado.slice(0, 9) +" | Idioma do servidor ( `"+ nome_server +"` | `"+ id_server +"` ) atualizado para `"+ idioma_selecionado +"`");
        });
    }
};

function constructJson(jsonKey, jsonValue){
    return { [jsonKey] : jsonValue }
}