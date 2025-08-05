const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

async function conecta_canal_voz(voice_channel, som) {

    const connection = joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: voice_channel.guild.id,
        adapterCreator: voice_channel.guild.voiceAdapterCreator
    })

    try {
        // Espera a conexão ficar pronta
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000)
    } catch (err) {
        connection.destroy()
        return console.log('Erro ao conectar no canal de voz: ' + err.message)
    }

    // Criando o player
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause, // pausa se ninguém estiver ouvindo
        }
    })

    // Cria o recurso de áudio local
    const resource = createAudioResource(som, {
        inlineVolume: true, // opcional: permite ajustar volume
    })

    resource.volume.setVolume(0.7) // 50% do volume

    // Tocando o som
    player.play(resource)
    const subscription = connection.subscribe(player)

    if (!subscription)
        return console.log('Falha ao subscrever o player à conexão.')

    // Desconectando após terminar o som
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy()
    })

    player.on('error', (error) => {
        console.error('Erro no player:', error)
        connection.destroy()
    })
}

module.exports.conecta_canal_voz = conecta_canal_voz