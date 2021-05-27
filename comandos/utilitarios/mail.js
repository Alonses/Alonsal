const Discord = require('discord.js');

module.exports = async ({message, args}) => {

    content = content.split(" ");
    mensagem = "";

    
    if(message.author.id == "665002572926681128"){

        try{
            tipo = content[1];
            id_alvo = content[2];

            id_alvo = id_alvo.toString();
        }catch(e){
            message.channel.send(`:octagonal_sign: ${message.author} há um erro em sua mensagem, tente novamente.`)
            return;
        }

        for(var i = 3; i < content.length; i++){
            mensagem += content[i] + " ";
        }

        mensagem = mensagem.replace(id_alvo, "");

        try{
            if(tipo == "u")
                bot.users.cache.get(id_alvo).send(mensagem);
            else if(tipo == "c")
                bot.channels.cache.get(id_alvo).send(mensagem);

            message.channel.send(`${message.author} mensagem enviada :incoming_envelope:`);
        }catch(err){
            message.channel.send(`:octagonal_sign: ${message.author} não foi possível enviar a mensagem para este ID`);
            return;
        }
    }else{
        for(var i = 1; i < content.length; i++){
            mensagem += content[i] + " ";
        }
        
        mensagem = mensagem.substr(0, (mensagem.length - 1));

        const msg_user = new Discord.MessageEmbed()
        .setTitle("> New Message :mailbox_with_mail:")
        .setFooter("Author: "+ message.author.username)
        .setColor(0xffffff)
        .setDescription("-----------------------\nEnviada por `"+ message.author.id +"`\n\n Mensagem: `"+ mensagem + "`");

        try{
            bot.channels.cache.get("847191471379578970").send(msg_user);
            message.channel.send(`${message.author} mensagem enviada :incoming_envelope:`);
        }catch(err){
            message.channel.send(`:octagonal_sign: ${message.author} não foi possível enviar a mensagem para este ID`);
            return;
        }
    }

    message.delete();
}