module.exports = async function({message}){

    const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    
    return message.reply(":octagonal_sign: | "+ musicas[0]["aviso_5"]);
}