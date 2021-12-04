const fetch = require('node-fetch');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "mostra o avatar de um usuário",
    aliases: [ "vatar", "perfil" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        let user = message.mentions.users.first(); // Coleta o ID do usuário mencionado

        if(!user && args.length > 0){ 
            if(isNaN(args[0].value)) // Verifica se é um ID realmente
                return message.reply(`:octagonal_sign: | ${utilitarios[4]["id_user"]}`);

            try{ // Busca pelo usuário no server inteiro
                user = await message.guild.members.fetch(args[0].toString());
                user = user.user; // Separa os dados de usuário
            }catch(e){
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[4]["nao_conhecido"]}`);
            }
        }
        
        if(!user) // Usa o autor do comando como alvo em último caso
            user = message.author;

        let url_avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=512`;

        fetch(url_avatar)
        .then(res => {
            if(res.status !== 200)
                url_avatar = url_avatar.replace('.gif', '.webp')

            const embed = new MessageEmbed()
            .setTitle(`:bust_in_silhouette: ${utilitarios[4]["baixar_avatar"]}`)
            .setURL(url_avatar)
            .setColor(0x29BB8E)
            .setImage(url_avatar);
            
            message.reply({ embeds: [embed] });
        });
    }
}