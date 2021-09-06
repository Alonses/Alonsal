module.exports = async function({client, message}){
    
    const reload = require('auto-reload');
    const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
    const { musicas } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

    let Vchannel = message.member.voice.channel;
    let connection = client.VConnections[Vchannel.id];
    
    if(!connection) return;

    let dispatcher = connection.dispatcher;
    
    if(!Vchannel){
        await message.lineReply(musicas[0]["aviso_1"]);
        return;
    }
    
    if(dispatcher.paused){
        dispatcher.resume();
        message.lineReply(":arrow_forward: "+ musicas[0]["retomando"]);
    }
}