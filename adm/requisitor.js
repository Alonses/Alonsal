module.exports = async function({client, message, args, requisicao_auto}){
    
    var reload = require('auto-reload');
    const { idioma_servers } = reload('../arquivos/json/dados/idioma_servers.json');

    let prefix = client.prefixManager.getPrefix(message.guild.id);

    if(typeof idioma_servers[message.guild.id] == "undefined") // Registra o ID do servidor e o idioma do server
        require('./idioma.js')({client, message, args, requisicao_auto});

    if(message.content.startsWith(prefix+"lang")) // Troca o idioma do servidor
        require('./idioma.js')({client, message, args});

    if(message.content.startsWith(prefix+"ram")) // Exibe o uso de memória ram
        require('./memoria.js')({message});
}