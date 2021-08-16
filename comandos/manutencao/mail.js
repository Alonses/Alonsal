module.exports = {
    name: "mail",
    description: "Envie mensagens para o alonsal",
    aliases: [ "" ],
    usage: "mail <suamensagem>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const { aliases_user, ids_canais_games, ids_cargos_games } = require('../../config.json');
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        let content = args;
        let mensagem = "";
        let tipo = "Alonsal";
        let plataforma = "";
        let logo_plat = "";

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        if(content.length == 0){
            message.channel.send(":warning: | Sua mensagem está vazia, escreva algo para enviar");
            return;
        }

        if(aliases_user.includes(message.author.id)){
            try{
                tipo = content[0];
                id_alvo = content[1];

                id_alvo = id_alvo.toString();
            }catch(e){
                message.channel.send(":octagonal_sign: | Há um erro em sua mensagem, tente novamente.");
                return;
            }

            for(let i = 2; i < content.length; i++){
                mensagem += content[i] + " ";
            }

            mensagem = mensagem.replace(id_alvo, "");

            try{
                if(tipo === "games"){

                    let url = "";

                    if(message.attachments.size > 0){
                        message.attachments.forEach(attachment => {
                            url = attachment.url;
                        });
                    }
                    
                    if(args[4].includes("epicgames.com")){
                        logo_plat = emoji(emojis.lg_epicgames);
                        plataforma = "Epic";
                    }

                    if(args[4].includes("store.steam")){
                        logo_plat = emoji(emojis.lg_steam);
                        plataforma = "Steam";
                    }

                    if(args[4].includes("gog.com")){
                        logo_plat = emoji(emojis.lg_gog);
                        plataforma = "GOG";
                    }

                    if(args[4].includes("humblebundle.com")){
                        logo_plat = emoji(emojis.lg_humble);
                        plataforma = "Humble Bundle";
                    }

                    if(args[4].includes("ubisoft.com")){
                        logo_plat = emoji(emojis.lg_ubisoft);
                        plataforma = "Ubisoft";
                    }

                    let msg_game = new MessageEmbed()
                    .setColor(0x29BB8E)
                    .setTitle(logo_plat +" Game gratuito!")
                    .setURL(args[4])
                    .setDescription('Há novos conteúdos gratuitos pela `'+ plataforma + '`.\n\nResgate antes das `'+ args[1] +'` do dia `'+ args[2] +'` para poupar `'+ args[3] +'` e garantir em sua conta Eternamente!')
                    .setImage(url);

                    for(let i = 0; i < ids_canais_games.length; i++){
                        client.channels.cache.get(ids_canais_games[i]).send("<@&"+ ids_cargos_games[i] +">", msg_game);
                    }
                    
                    message.channel.send("A atualização foi enviada à todos os canais de games");
                }else{
                    if(tipo === "u")
                        client.users.cache.get(id_alvo).send(":postal_horn: [ "+ mensagem +"]\n\nCom ódio. Alonsal");
                    else if(tipo === "c"){

                        let canal_alvo = client.channels.cache.get(id_alvo);
                        let permissoes = canal_alvo.permissionsFor(message.client.user); // Permissões de fala para o canal informado

                        if(permissoes.has("SEND_MESSAGES")){
                            canal_alvo.send(mensagem);

                            message.channel.send(`Mensagem enviada para [ \`${id_alvo}\`, \`${canal_alvo.name}\` ] :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:`);
                        }else{
                            const feedbc = await message.channel.send(`:hotsprings: | Eu não posso enviar mensagens para o canal \`${canal_alvo.name}\` :(`);

                            setTimeout(() => {
                                feedbc.delete();
                            }, 5000);

                            message.delete();
                            return;
                        }
                    }    
                }
            }catch(err){
                message.channel.send(`:octagonal_sign: | Não foi possível enviar a mensagem para este ID`);
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
            
            message.channel.send(`Mensagem enviada para o Alonsal :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:`);
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