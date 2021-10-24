module.exports = {
    name: "botavatar",
    description: "Altere o avatar do alonsal",
    aliases: [ "bta" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
    
        if(!client.owners.includes(message.author.id)) return;
        
        let novo_perfil;
        
        if(message.attachments.size > 0){

            let attachment = message.attachments.first();
            let url = attachment.url;
            
            novo_perfil = url;
        }else{
            novo_perfil = args[0];
            novo_perfil = novo_perfil.replace("<", "");
            novo_perfil = novo_perfil.replace(">", "");
        }

        if(!novo_perfil.includes(".png") && !novo_perfil.includes(".jpg") && !novo_perfil.includes(".jpeg") && !novo_perfil.includes(".bmp"))
            return message.reply(":octagonal_sign: | Envie um link/arquivo diferente de gif");

        await client.user.setAvatar(novo_perfil);
        message.reply(":bust_in_silhouette: | Avatar enceirado atualizado");
    }
}