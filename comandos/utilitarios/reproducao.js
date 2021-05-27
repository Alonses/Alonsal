module.exports = async({message, args}) => {

    message.channel.send(`Reprodução solicitada por [ ${message.author} ]`);

    message.channel.send(message, {
        tts: true
    });
}