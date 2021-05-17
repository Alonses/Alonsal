module.exports = async function({message}) {

    const m = await message.channel.send("Ping?");
    console.log("ping");
    m.edit(`Pong! Tá lagado um poco tô renderizando vídeo [ ${m.createdTimestamp - message.createdTimestamp}ms ].`);
}