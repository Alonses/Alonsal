module.exports = async function({client, message, args, guild}) {

    console.log("aq");

    const { idioma_servers } = require('../arquivos/json/dados/idioma_servers.json');
    let prefix;

    idioma_padrao = "pt-br"; // O idioma padrão do Alonsal

    if(typeof guild == "undefined"){
        prefix = client.prefixManager.getPrefix(message.guild.id);

        if(typeof idioma_servers[message.guild.id] != "undefined")
            idioma_padrao = idioma_servers[message.guild.id];
    }

    const { moderacao } = require('../arquivos/idiomas/'+ idioma_padrao +'.json');
    let idioma_selecionado;

    if(typeof guild == "undefined"){
        if(!message.member.hasPermission('MANAGE_GUILD'))
            return message.lineReply(":octagonal_sign: | "+ moderacao[3]["permissao_1"]);
    }

    const fs = require('fs');
    
    function constructJson(jsonKey, jsonValue){
        return { [jsonKey] : jsonValue }
    }

    if(typeof guild == "undefined"){
        let { moderacao } = require('../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        if(args[1] !== "pt" && args[1] !== "en")
            return message.reply(moderacao[0]["error"].replaceAll(".a", prefix));
    }else
        idioma_selecionado = "pt-br";

    let nome_server;
    if(typeof guild.id == "undefined"){
        id_server = message.guild.id;
        nome_server = message.guild.name;
    }else{
        id_server = guild.id;
        nome_server = guild.name;
    }

    let outputArray = []; // Transfere todos os dados do JSON para um array
    for(let element in idioma_servers){

        idioma = idioma_servers[element];

        outputArray.push(
            constructJson(element, idioma)
        );
    }

    if(typeof guild == "undefined"){
        let idioma_alterado = ":flag_br: | Idioma alterado para `Português Brasileiro`";

        if(args[1] === "pt")
            idioma_selecionado = "pt-br";

        if(args[1] === "en"){
            idioma_selecionado = "en-us";
            idioma_alterado = ":flag_us: | Language switched to `American English`";
        }

        for(let i = 0; i < outputArray.length; i++){ // Procura pelo ID do server e altera o idioma
            let obj = outputArray[i];

            let key = Object.keys(idioma_servers);

            if(key[i] === message.guild.id){
                obj[message.guild.id] = idioma_selecionado;
                break;
            }
        }
        
        message.reply(idioma_alterado);
    }else
        outputArray.push(constructJson(id_server, idioma_selecionado));

    idioma_servidor = JSON.stringify(outputArray, null, 5);

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