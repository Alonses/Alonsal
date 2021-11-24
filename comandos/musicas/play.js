const { RepeatMode } = require('discord-music-player');

module.exports = async function({message, client, args}){

    if (message.author.id !== "665002572926681128") return;

    const { musicas } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

    if(!message.member.voice.channel) return message.reply("Entre em um canal de voz para utilizar esses comandos");
    
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(command === 'play') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'playlist') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'skip') {
        message.channel.send(":fast_forward: "+ musicas[5]["pulando_1"]);
        guildQueue.skip();
    }

    if(command === 'stop')
        guildQueue.stop();

    if(command === 'removeLoop')
        guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED

    if(command === 'toggleLoop')
        guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG

    if(command === 'toggleQueueLoop')
        guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE

    if(command === 'setVolume')
        guildQueue.setVolume(parseInt(args[0]));

    if(command === 'seek')
        guildQueue.seek(parseInt(args[0]) * 1000);

    if(command === 'clearQueue')
        guildQueue.clearQueue();

    if(command === 'shuffle')
        guildQueue.shuffle();

    if(command === 'getQueue')
        console.log(guildQueue);

    if(command === 'getVolume')
        console.log(guildQueue.volume)

    if(command === 'nowPlaying')
        message.reply(`Tocando agora :: ${guildQueue.nowPlaying}`);

    if(command === 'pause') {
        message.reply(":pause_button: "+ musicas[0]["pausando"]);
        guildQueue.setPaused(true);
    }

    if(command === 'resume') {
        message.reply(":arrow_forward: "+ musicas[0]["retomando"]);
        guildQueue.setPaused(false);
    }

    if(command === 'remove')
        guildQueue.remove(parseInt(args[0]));

    if(command === 'createProgressBar') {
        const ProgressBar = guildQueue.createProgressBar();
        message.reply(ProgressBar.prettier);
    }

    // client.player
    // // Emitted when channel was empty.
    // .on('channelEmpty', (queue) =>
    //     message.channel.send(`Todos sairam do canal de voz, a playlist foi encerrada.`))
    // // Emitted when a song was added to the queue.
    // .on('songAdd', (queue, song) =>
    //     message.channel.send(`A faixa \`${song}\` foi adicionada a playlist.`))
    // // Emitted when a playlist was added to the queue.
    // .on('playlistAdd', (queue, playlist) =>
    //     message.channel.send(`Uma playlist ${playlist} com outras ${playlist.songs.length} faixas foi adicionada a fila atual.`))
    // // Emitted when there was no more music to play.
    // .on('queueDestroyed', (queue) =>
    //     message.channel.send(`A playlist foi apagada.`))
    // // Emitted when the queue was destroyed (either by ending or stopping).    
    // .on('queueEnd', (queue) =>
    //     message.channel.send(`A playlist foi encerrada.`))
    // // Emitted when a song changed.
    // .on('songChanged', (queue, newSong, oldSong) =>
    //     message.channel.send(`${newSong} esta tocando agora.`))
    // // Emitted when a first song in the queue started playing.
    // .on('songFirst', (queue, song) =>
    //     message.channel.send(`Começando agora :: \`${song}\`.`))
    // // Emitted when someone disconnected the bot from the channel.
    // .on('clientDisconnect', (queue) =>
    //     message.channel.send(`Eu fui expulso do canal de voz, a playlist foi encerrada.`))
    // // Emitted when deafenOnJoin is true and the bot was undeafened
    // .on('clientUndeafen', (queue) =>
    //     message.channel.send(`I got undefeanded.`))
    // // Emitted when there was an error in runtime
    // .on('error', (error, queue) => {
    //     message.channel.send(`Erro: ${error} em ${queue.guild.name}`);
    // });
}