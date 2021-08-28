module.exports = async function({message, client}){
    let Vchannel = message.member.voice.channel;
    let connection = client.VConnections[Vchannel.id];

    if(!connection) return;
    let dispatcher = connection.dispatcher;
    
    if(!Vchannel){
        await message.lineReply('Entre em um canal de voz p/ utilizar estes comandos');
        return;
    }
    
    if(!dispatcher.paused){
        dispatcher.pause();
        message.lineReply(":pause_button: Pausado, digite `.asr` para retomar.");
    }
}