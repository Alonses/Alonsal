const { MessageEmbed } = require('discord.js');

module.exports = async ({client, message, args}) => {

    let content = args
    let mensagem = ""
    let tipo = "Alonsal"
    
    if(message.author.id === "665002572926681128" || message.author.id === "852589532993683467"){
        try{
            tipo = content[0]
            id_alvo = content[1]

            id_alvo = id_alvo.toString()
        }catch(e){
            message.channel.send(`:octagonal_sign: ${message.author} há um erro em sua mensagem, tente novamente.`)
            return
        }

        for(let i = 2; i < content.length; i++){
            mensagem += content[i] + " ";
        }

        mensagem = mensagem.replace(id_alvo, "")

        try{
            if(tipo === "u")
                client.users.cache.get(id_alvo).send(":postal_horn: [ "+ mensagem +"]\n\nCom ódio. Alonsal")
            else if(tipo === "c")
                client.channels.cache.get(id_alvo).send(mensagem)

            message.channel.send(`${message.author}`+ " mensagem enviada para [ `"+ id_alvo +"` ] :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:")
        }catch(err){
            message.channel.send(`:octagonal_sign: ${message.author} não foi possível enviar a mensagem para este ID`)
            return
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

        try{
            client.channels.cache.get("847191471379578970").send(msg_user)
            message.channel.send(`${message.author} mensagem enviada para o Alonsal :incoming_envelope:\nDespachei mais informações no seu privado :mailbox_with_mail:`)
        }catch(err){
            message.channel.send(`:octagonal_sign: ${message.author} não foi possível enviar a mensagem sua mensagem no momento, tente novamente mais tarde`)
            return
        }
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
        message.delete()
    else
        message.channel.send(":tools: Não foi possivel excluir sua mensagem automaticamente, para isto preciso de permissões para gerenciar as mensagens.")
}