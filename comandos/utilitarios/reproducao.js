module.exports = {
    name: "reproducao",
    description: "Faça o Alonsal falar algo",
    aliases: [ "rep" ],
    usage: ".arep <message>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        message.channel.send(`Reprodução solicitada por [ ${message.author} ]`);
        
        mensagem = message.content.replace(".arep", "")

        message.channel.send(mensagem, {
            tts: true
        });
    }
};