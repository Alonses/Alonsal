module.exports = async function({message}){

    const { musicas } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');
    
    return message.reply(":octagonal_sign: | "+ musicas[0]["aviso_5"]);
}