module.exports = {
    name: "mail",
    description: "Envie mensagens para o alonsal",
    aliases: [ "" ],
    usage: "mail <suamensagem>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const { aliases_user } = require('../../config.json');

        let content = args;
        let mensagem = "";
        let tipo = "Alonsal";

        if(aliases_user.includes(message.author.id)){
            try{
                tipo = content[0];
                id_alvo = content[1];

                id_alvo = id_alvo.toString();
            }catch(e){
                message.lineReply(":octagonal_sign: | Há um erro em sua mensagem, tente novamente.").then(message => message.delete());
                return;
            }

            for(let i = 2; i < content.length; i++){
                mensagem += content[i] + " ";
            }

            mensagem = mensagem.replace(id_alvo, "");

            try{
                if(tipo === "u")
                    client.users.cache.get(id_alvo).send(":postal_horn: [ "+ mensagem +"]\n\nCom ódio. Alonsal");
                else if(tipo === "c"){

                    let canal_alvo = client.channels.cache.get(id_alvo);
                    let permissoes = canal_alvo.permissionsFor(message.client.user); // Permissões de fala para o canal informado

                    if(permissoes.has("SEND_MESSAGES")){
                        canal_alvo.send(mensagem);

                        message.lineReply(`:hotsprings: | Mensagem enviada para [ \`${id_alvo}\`, \`${canal_alvo.name}\` ] :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:`).then(message => message.delete({timeout: 5000}));
                    }else{
                        message.lineReply(`:hotsprings: | Eu não posso enviar mensagens no canal \`${canal_alvo.name}\` :(`).then(message => message.delete({timeout: 5000}));;

                        message.delete();
                        return;
                    }
                }
            }catch(err){
                message.lineReply(':octagonal_sign: | Não foi possível enviar a mensagem para este ID');
                return;
            }
        }else{
            for(let i = 0; i < content.length; i++){
                mensagem += content[i] + " ";
            }
            
            mensagem = mensagem.substr(0, (mensagem.length - 1));

            const msg_user = new MessageEmbed()
            .setTitle("> New Message :mailbox_with_mail:")
            .setFooter("Author: "+ message.author.username)
            .setColor(0xffffff)
            .setDescription("-----------------------\nEnviada por `"+ message.author.id +"`\n\n Mensagem: `"+ mensagem + "`")
            .setTimestamp();

            client.channels.cache.get("847191471379578970").send(msg_user);
            
            message.lineReply(':hotsprings: | Mensagem enviada para o Alonsal :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:').then(message => message.delete({timeout: 5000}));
        }

        if(tipo === "c")
            tipo = client.channels.cache.get(id_alvo).name;
        else if(tipo === "u")
            tipo = client.users.cache.get(id_alvo).username;

        if(tipo !== "Alonsal")
            mensagem = mensagem.substr(0, (mensagem.length - 1));

        mensagem2 = mensagem;

        graves = mensagem2.split("`").length - 1; // separa em blocos e confere se são válidos para uma formatação do discord

        if(graves > 0){
            while(graves > 0){
                mensagem = mensagem.replace("`", "\'");
                graves--;
            }
        }

        const embed = new MessageEmbed()
        .setTitle(':mailbox: Sua mensagem foi entregue!')
        .setColor(0x29BB8E)
        .setDescription("Sua mensagem foi entregue para o/a `"+ tipo +"`\n\nO Conteúdo da mensagem é :: \n`"+ mensagem +"`")
        .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png")
        .setTimestamp();
        
        client.users.cache.get(message.author.id).send(embed);
        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        else
            message.channel.send(":tools: | Não foi possivel excluir sua mensagem automaticamente, para isto preciso de permissões para gerenciar as mensagens.");
    }
};