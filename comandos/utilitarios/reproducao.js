module.exports = {
    name: "rep",
    description: "Faça o Alonsal falar algo",
    aliases: [ "" ],
    usage: "",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        message.delete();

        const Discord = require('discord.js');

        if(message.attachments.size > 1 || (message.attachments.size == 0 && args.length < 1)){
            let text_aviso = ":hotsprings: | Escreva algo ou envie um arquivo para mim e eu retornarei ele";

            if(message.attachments.size > 1)
                text_aviso = ":hotsprings: | Envie apenas 1 arquivo por vez";

            const aviso = await message.channel.send(text_aviso);

            setTimeout(() => {
                aviso.delete();
            }, 5000);

            return;
        }

        let conteudo = (message.content).toLowerCase();

        if(conteudo.includes("hora certa")){
            const hora_certa = new Discord.MessageAttachment("arquivos/songs/hora_certa.mp3");
            message.channel.send("Hora Certa!", hora_certa);

            return;
        }

        if(conteudo == ".arep avast"){
            const avast = new Discord.MessageAttachment("arquivos/songs/avast.mp3");
            message.channel.send( avast);

            return;
        }

        if(conteudo == ".arep kadu"){
            const kadu = new Discord.MessageAttachment("arquivos/songs/kadu.mp3");
            message.channel.send(kadu);

            return;
        }

        if(message.attachments.size == 0){

            message.channel.send(`Reprodução solicitada por [ ${message.author} ]`);    
            let mensagem = message.content.replace(".arep", "")

            message.channel.send(mensagem, {
                tts: true
            });
        }else{
            message.attachments.forEach(attachment => {
                
                const arquivo_atach = new Discord.MessageAttachment(attachment.url);
                message.channel.send(`Arquivo enviado por [ ${message.author} ]`, arquivo_atach);
            });
        }
    }
};