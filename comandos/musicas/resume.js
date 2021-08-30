module.exports = async function({client, message}){
    let Vchannel = message.member.voice.channel;
    let connection = client.VConnections[Vchannel.id];
    
    if(!connection) return;

    let dispatcher = connection.dispatcher;
    
    if(!Vchannel){
        await message.lineReply("Entre em um canal de voz p/ utilizar estes comandos");
        return;
    }
    
    if(dispatcher.paused){
        dispatcher.resume();
        message.lineReply(":arrow_forward: Retomando, digite `.asp` para pausar.");
    }
}