module.exports = async function({message, client}){
    
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
    
    if(!dispatcher.paused){
        dispatcher.pause();
        message.lineReply(":pause_button: "+ musicas[0]["pausando"]);
    }
}