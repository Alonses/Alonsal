const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mail",
    description: "Envie mensagens para o alonsal",
    aliases: [ "" ],
    usage: "mail <any>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);

        let mensagem = "";
        let tipo = "Alonsal";
        let id_alvo;

        if(client.owners.includes(message.author.id)){

            if(args.length < 2) return message.reply("Informe o tipo de alvo ( `c`, `u` ), o ID do seu alvo e a mensagem para enviar\nPor exemplo, `.amail c 4002892 oito e sete!`".replace(".a", prefix));

            try{
                tipo = args[0].raw;
                id_alvo = args[1].raw;
            }catch(e){
                return await message.reply(`:octagonal_sign: | ${manutencao[3]["aviso_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
            }

            args.shift();
            mensagem = args.join(" ").replace(id_alvo, "").replaceAll("`", "\'");

            try{
                if(tipo === "u")
                    client.users.cache.get(id_alvo).send(`:postal_horn: [ ${mensagem} ]\n\nCom ódio. Alonsal`);
                else if(tipo === "c"){

                    const canal_alvo = client.channels.cache.get(id_alvo);
                    const permissoes = canal_alvo.permissionsFor(message.client.user); // Permissões de fala para o canal informado

                    if(permissoes.has("SEND_MESSAGES")){
                        canal_alvo.send(mensagem);

                        await message.reply(`:hotsprings: | ${manutencao[3]["aviso_4"]} [ \`${id_alvo}\`, \`${canal_alvo.name}\` ] ${manutencao[3]["aviso_5"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
                    }else
                        return await message.reply(`:hotsprings: | ${manutencao[3]["aviso_6"]} \`${canal_alvo.name}\` :(`).then(msg => setTimeout(() => msg.delete(), 5000));
                }
            }catch(err){
                return message.reply(`:octagonal_sign: | ${manutencao[3]["error_1"]}`);
            }
        }else{
            
            mensagem = args.join(" ").replaceAll("`", "\'");

            const msg_user = new MessageEmbed()
            .setTitle("> :mailbox_with_mail: New Message")
            .setFooter(`Author: ${message.author.username}`)
            .setColor(0xffffff)
            .setDescription(`-----------------------\nSent by \`${message.author.id}\`\n\n Message: \`${mensagem}\``)
            .setTimestamp();

            client.channels.cache.get("847191471379578970").send({ embeds: [msg_user] });
            
            await message.reply(`:hotsprings: | ${manutencao[3]["sucesso_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
        }

        if (tipo === "c")
            tipo = client.channels.cache.get(id_alvo).name;
        else if(tipo === "u")
            tipo = client.users.cache.get(id_alvo).username;

        const embed = new MessageEmbed()
            .setTitle(manutencao[3]["aviso_2"])
            .setColor(0x29BB8E)
            .setDescription(`${manutencao[3]["conteudo_1"]} \`${tipo}\`\n\n${manutencao[3]["conteudo_2"]} :: \n\`${mensagem}\``)
            .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png")
            .setTimestamp();

        await client.users.cache.get(message.author.id).send({ embeds: [embed] });
        const permissions = message.channel.permissionsFor(message.client.user);

        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
        else
            message.reply(`:tools: | ${manutencao[3]["aviso_3"]}`);
    }
};