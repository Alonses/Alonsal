const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mail",
    description: "Envie mensagens para o alonsal",
    aliases: [ "" ],
    usage: "mail <suamensagem>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        let content = args;
        let mensagem = "";
        let tipo = "Alonsal";
        let id_alvo;

        if(message.author.id === "665002572926681128"){
            try{
                tipo = content[0];
                id_alvo = content[1];

                id_alvo = id_alvo.toString();
            }catch(e){
                return message.reply(":octagonal_sign: | "+ manutencao[3]["aviso_1"]).then(message => message.delete({timeout: 5000}));
            }

            for(let i = 2; i < content.length; i++){
                mensagem += content[i] +" ";
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

                        message.reply(":hotsprings: | "+ manutencao[3]["aviso_4"] +`[ \`${id_alvo}\`, \`${canal_alvo.name}\` ] `+ manutencao[3]["aviso_5"]).then(message => message.delete({timeout: 5000}));
                    }else
                        return message.reply(":hotsprings: | "+ manutencao[3]["aviso_6"] +`\`${canal_alvo.name}\` :(`).then(message => message.delete({timeout: 5000}));
                }
            }catch(err){
                return message.reply(":octagonal_sign: | "+ manutencao[3]["error_1"]);
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
            .setDescription("-----------------------\nSent by `"+ message.author.id +"`\n\n Message: `"+ mensagem + "`")
            .setTimestamp();

            client.channels.cache.get("847191471379578970").send({ embeds: [msg_user] });
            
            message.reply(":hotsprings: | "+ manutencao[3]["sucesso_1"]).then(message => message.delete({timeout: 5000}));
        }

        if(tipo === "c")
            tipo = client.channels.cache.get(id_alvo).name;
        else if(tipo === "u")
            tipo = client.users.cache.get(id_alvo).username;

        if(tipo !== "Alonsal")
            mensagem = mensagem.substr(0, (mensagem.length - 1));

        const mensagem2 = mensagem;

        let graves = mensagem2.split("`").length - 1; // separa em blocos e confere se são válidos para uma formatação do discord

        if(graves > 0)
            while(graves > 0){
                mensagem = mensagem.replace("`", "\'");
                graves--;
            }

        const embed = new MessageEmbed()
        .setTitle(manutencao[3]["aviso_2"])
        .setColor(0x29BB8E)
        .setDescription(manutencao[3]["conteudo_1"] +" `"+ tipo +"`\n\n"+ manutencao[3]["conteudo_2"] +" :: \n`"+ mensagem +"`")
        .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png")
        .setTimestamp();
        
        await client.users.cache.get(message.author.id).send({ embeds: [embed] });
        const permissions = await message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        else
            message.reply(":tools: | " + manutencao[3]["aviso_3"]).then(message => message.delete({timeout: 5000}));
    }
};