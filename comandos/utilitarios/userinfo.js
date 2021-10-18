const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "userinfo",
    description: "Veja detalhes de algum usuario",
    aliases: [ "usinfo" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_selecionado = idioma_servers[message.guild.id];

        let user = message.mentions.users.first(); // Coleta o ID do usuário

        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if(!user && args[0] != null){
            if(isNaN(args[0]))
                return message.reply(":octagonal_sign: | "+ utilitarios[4]["id_user"]);

            try{
                user = await message.guild.members.fetch(args[0]);

                user = user.user; // Pega o usuário pelo ID
            }catch(e){
                return message.reply(emoji_nao_encontrado + " | "+ utilitarios[4]["nao_conhecido"]);
            }
        }
        
        if(!user)
            user = message.author;

        let avatar_user = user.displayAvatarURL({ size: 2048 }); 
    
        const url = 'https://cdn.discordapp.com/avatars/'+ user.id +'/'+ user.avatar +'.gif?size=512';
        avatar_user = url;

        let membro_sv = message.guild.members.cache.get(user.id); // Coleta dados como membro
        data_entrada = new Date(membro_sv.joinedTimestamp);

        if(idioma_selecionado == "pt-br")
            data_entrada = data_entrada.getDate() +" de "+ data_entrada.toLocaleString('pt', { month: 'long' }) +" de "+ data_entrada.getFullYear() +" às "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);
        else
            data_entrada = data_entrada.toLocaleString('en', { month: 'long' }) +" "+ data_entrada.getDate() +", "+ data_entrada.getFullYear() +" at "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);

        let data_criacao = new Date(user.createdAt); // Criação do servidor
        if(idioma_selecionado == "pt-br")
            data_criacao = data_criacao.getDate() +" de "+ data_criacao.toLocaleString('pt', { month: 'long' }) +" de "+ data_criacao.getFullYear() +" às "+ ("0"+ data_criacao.getHours()).substr(-2) +":"+ ("0"+ data_criacao.getMinutes()).substr(-2);
        else
            data_criacao = data_criacao.toLocaleString('en', { month: 'long' }) +" "+ data_criacao.getDate() +", "+ data_criacao.getFullYear() +" at "+ ("0"+ data_criacao.getHours()).substr(-2) +":"+ ("0"+ data_criacao.getMinutes()).substr(-2);

        if(avatar_user !== null){
            avatar_user = avatar_user.replace(".webp", ".gif");

            await fetch(avatar_user)
            .then(res => {
                if(res.status !== 200)
                avatar_user = avatar_user.replace('.gif', '.webp')
            });
        }else
            avatar_user = "";

        let infos_user = new MessageEmbed()
        .setTitle(user.username +"#"+ user.discriminator)
        .setColor(0x29BB8E)
        .setThumbnail(avatar_user)
        .addFields(
            { name: ':globe_with_meridians: **'+ utilitarios[13]["id_user"] +'**', value: "`"+ user.id +"`", inline: true },
            { name: ':parachute: **'+ utilitarios[13]["entrada"] +'**', value: `\`${data_entrada}\``, inline: true},
            { name: ':birthday: **'+ utilitarios[13]["conta_criada"] +'**', value: `\`${data_criacao}\``, inline: true}
        )
        .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));
        
        return message.reply({embeds: [infos_user]});
    }
}