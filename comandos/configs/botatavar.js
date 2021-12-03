const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "botavatar",
    description: "Altere o avatar do alonsal",
    aliases: [ "bta" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
    
        if(!client.owners.includes(message.author.id)) return;
        
        let novo_perfil;
        
        if(message.attachments.size > 0) {
            novo_perfil = message.attachments.first().url;
        } else {
            novo_perfil = args[0];
            novo_perfil = novo_perfil.replace("<", "").replace(">", "");
        }

        if(!novo_perfil.includes(".png") && !novo_perfil.includes(".jpg") && !novo_perfil.includes(".jpeg") && !novo_perfil.includes(".bmp"))
            return message.reply(":octagonal_sign: | Envie um link/arquivo diferente de gif");

        await client.user.setAvatar(novo_perfil);
        message.reply(":bust_in_silhouette: | Avatar enceirado atualizado");

        const att_avatar = new MessageEmbed()
        .setTitle(":bust_in_silhouette: O Avatar do Alonsal foi alterado")
        .setColor(0x29BB8E)
        .setImage(novo_perfil)
        .setDescription(`**Alterado por** ( \`${message.author.username}\` | \`${message.author.id}\` )`);

        client.channels.cache.get('872865396200452127').send({embeds: [att_avatar]});
    }
}