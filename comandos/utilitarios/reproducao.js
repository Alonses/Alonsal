module.exports = {
    name: "reproducao",
    description: "Faça o Alonsal falar algo",
    aliases: [ "rep" ],
    usage: "rep <suamensagem>",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.lineReply(`Reprodução solicitada por [ ${message.author} ]`);
        
        mensagem = message.content.replace(".arep", "")

        message.channel.send(mensagem, {
            tts: true
        });
    }
};