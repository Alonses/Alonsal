module.exports = {
    name: "rep",
    description: "Faça o Alonsal falar algo",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();

        const Discord = require('discord.js');

        if(message.attachments.size > 1 || (message.attachments.size == 0 && args.length < 1)){
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
            const hora_certa = new Discord.MessageAttachment("arquivos/songs/hora_certa.mp3");
            message.channel.send(utilitarios[6]["hora_certa"], hora_certa);

            return;
        }

        if(conteudo == ".arep avast"){
            const avast = new Discord.MessageAttachment("arquivos/songs/avast.mp3");
            message.channel.send( avast);

            return;
        }

        if(conteudo == ".arep malakoi"){
            const malakoi = new Discord.MessageAttachment("arquivos/songs/malakoi.mp3");
            message.channel.send(malakoi);

            return;
        }

        if(conteudo == ".arep kadu"){
            const kadu = new Discord.MessageAttachment("arquivos/songs/kadu.mp3");
            message.channel.send(kadu);

            return;
        }

        if(message.attachments.size == 0){

            message.channel.send(utilitarios[6]["reproducao_1"] +` [ ${message.author} ]`);    
            let mensagem = message.content.replace(".arep", "")

            message.channel.send(mensagem, {
                tts: true
            });
        }else{
            message.attachments.forEach(attachment => {
                
                const arquivo_atach = new Discord.MessageAttachment(attachment.url);
                message.channel.send(utilitarios[6]["reproducao_2"] +` [ ${message.author} ]`, arquivo_atach);
            });
        }
    }
};