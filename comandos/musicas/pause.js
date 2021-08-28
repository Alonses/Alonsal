module.exports = async function({message, client}){
    let Vchannel = message.member.voice.channel
    let connection = client.VConnections[Vchannel.id]

    if(!connection) return
    let dispatcher = connection.dispatcher
    
    if(!Vchannel){
        await message.channel.send('Entre em um canal de voz p/ utilizar estes comandos')
        return
    }
    
    if(!dispatcher.paused){
        dispatcher.pause()
        message.channel.send(":pause_button: Pausado, digite `.asr` para retomar.")
    }
}