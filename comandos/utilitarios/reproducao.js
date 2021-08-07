module.exports = {
    name: "rep",
    description: "Faça o Alonsal falar algo",
    aliases: [ "" ],
    usage: "rep <sua_mensagem>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.lineReply(`Reprodução solicitada por [ ${message.author} ]`);    
        mensagem = message.content.replace(".arep", "")

        message.channel.send(mensagem, {
            tts: true
        });
    }
};