module.exports = async ({ client, message }) => {
    let Vchannel = message.member.voice.channel
    let connection = client.VConnections[Vchannel.id]
    
    if(!connection) return

    let dispatcher = connection.dispatcher
    
    if(!Vchannel){
        await message.channel.send('Entre em um canal de voz p/ utilizar estes comandos')
        return
    }
    
    if(dispatcher.paused){
        dispatcher.resume()
        message.channel.send(":arrow_forward: Retomando, digite `.asp` para pausar.")
    }
}