module.exports = async({message}) => {

    message.channel.send(`Reprodução solicitada por [ ${message.author} ]`);

    mensagem = message.content.replace(".arep", "")

    message.channel.send(mensagem, {
        tts: true
    });
}