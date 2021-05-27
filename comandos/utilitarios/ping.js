module.exports = async function({message}) {

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Tá lagado um poco tô renderizando vídeo [ ${m.createdTimestamp - message.createdTimestamp}ms ].`);
}