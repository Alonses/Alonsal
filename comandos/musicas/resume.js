module.exports = async function({client, message}){
    
    const { musicas } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

    let Vchannel = message.member.voice.channel;
    let connection = client.VConnections[Vchannel.id];
    
    if(!connection) return;

    let dispatcher = connection.dispatcher;
    
    if(!Vchannel){
        await message.reply(musicas[0]["aviso_1"]);
        return;
    }
    
    if(dispatcher.paused){
        dispatcher.resume();
        message.reply(":arrow_forward: "+ musicas[0]["retomando"]);
    }
}