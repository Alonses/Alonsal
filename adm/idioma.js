module.exports = async function({client, message, args, guild}) {

    const { idioma_servers } = require('../arquivos/json/dados/idioma_servers.json');
    const fs = require('fs');

    let idioma_definido = guild.preferredLocale.toLocaleLowerCase();
    let bandeira_pais = ":flag_"+ idioma_definido.slice(3, 7) +":";

    let prefix = client.prefixManager.getPrefix(guild.id);
    if(!prefix)
        prefix = ".a";
    
    function constructJson(jsonKey, jsonValue){
        return { [jsonKey] : jsonValue }
    }
    
    let idioma;
    let outputArray = []; // Transfere todos os dados do JSON para um array
    for(let element in idioma_servers){

        idioma = idioma_servers[element];

        outputArray.push(
            constructJson(element, idioma)
        );
    }

    outputArray.push(constructJson(guild.id, idioma_definido));
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
        
        client.channels.cache.get('872865396200452127').send(bandeira_pais +" | Idioma do servidor ( `"+ guild.name +"` | `"+ guild.id +"` ) definido como `"+ idioma_definido +"`");
    });
    
    let canal = await client.channels.cache.get(guild.systemChannelId);
    
    console.log(canal.type);
    
    if (canal.type === "GUILD_TEXT") {
        const permissions = canal.permissionsFor(client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }
    
    canal.send("Obrigado por me adicionar! Utilize o `"+ prefix +"h` para ver minha lista de comandos, você também pode alterar meu prefixo com o `"+ prefix +"px <prefixo>` ou meu idioma com o `"+ prefix +"lang en`!\n\nThanks for adding me! Use `"+ prefix +"h` to see my command list, you can also change my prefix with `"+ prefix +"px <prefix>` or my language with `"+ prefix +"lang pt`!");
}