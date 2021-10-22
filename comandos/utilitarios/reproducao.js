const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "rep",
    description: "Faça o Alonsal falar algo",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { utilitarios } = require('../../arquivos/idiomas/'+ client.idioma.getLang(message.guild.id) +'.json');

        const permissions = message.channel.permissionsFor(message.client.user);
        
        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";
            
        if(message.attachments.size > 1 || (message.attachments.size === 0 && args.length < 1)){
            let text_aviso = ":hotsprings: | "+ utilitarios[6]["aviso_1"];

            if(message.attachments.size > 1)
                text_aviso = ":hotsprings: | "+ utilitarios[6]["aviso_2"];

            const aviso = await message.channel.send(text_aviso);

            setTimeout(() => {
                aviso.delete();
            }, 5000);

            return;
        }

        let conteudo = (message.content).toLowerCase();

        if(conteudo.includes("hora certa") || conteudo.includes("right time")){
            const hora_certa = new MessageAttachment("arquivos/songs/hora_certa.mp3");
            return message.channel.send(utilitarios[6]["hora_certa"], hora_certa);
        }

        if(conteudo === prefix+"rep avast"){
            const avast = new MessageAttachment("arquivos/songs/avast.mp3");
            return message.channel.send(avast);
        }

        if(conteudo === prefix+"rep malakoi"){
            const malakoi = new MessageAttachment("arquivos/songs/malakoi.mp3");
            return message.channel.send(malakoi);
        }

        if(conteudo === prefix+"rep kadu"){
            const kadu = new MessageAttachment("arquivos/songs/kadu.mp3");
            return message.channel.send(kadu);
        }

        if(message.attachments.size === 0){
            if(!permissions.has("SEND_TTS_MESSAGES"))
                return message.reply(":octagonal_sign: | "+ utilitarios[6]["error_1"]);

            message.channel.send(utilitarios[6]["reproducao_1"] +` [ ${message.author} ]`);    
            let mensagem = message.content.replace(prefix+"rep", "");

            message.channel.send(mensagem, {
                tts: true
            });
        }else{
            message.attachments.forEach(attachment => {
                const arquivo_atach = new MessageAttachment(attachment.url);
                message.channel.send({ content: utilitarios[6]["reproducao_2"] +` [ ${message.author} ]`, attachments: [arquivo_atach] });
            });
        }

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};