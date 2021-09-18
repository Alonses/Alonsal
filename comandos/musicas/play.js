module.exports = async function({message}){

    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    
    return message.lineReply(":octagonal_sign: | "+ musicas[0]["aviso_5"]);
}