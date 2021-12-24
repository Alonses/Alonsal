const { readdirSync } = require("fs");
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
};

module.exports = {
    name: "rank",
    description: "Veja seu rank no servidor",
    aliases: [ "r" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        let usuario_alvo = [];

        const { utilitarios, diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);

        let rodape = message.author.username;
        const users = [];
        let user_alvo = message.mentions.users.first(); // Coleta o ID do usuário mencionado
        const emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
// 
        if(!user_alvo && args.length > 0 && args[0].raw.length === 18){ 
            if (isNaN(Number(args[0].raw))) // Verifica se é um ID realmente
                return message.reply(`:octagonal_sign: | ${utilitarios[4]["id_user"]}`);

            try{ // Busca pelo usuário no server inteiro
                user_alvo = await message.guild.members.fetch(args[0].raw);
                user_alvo = user_alvo.user; // Separa os dados de usuário
            }catch(e){
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[4]["nao_conhecido"]}`);
            }
        }

        if(args.length > 0)
            if(!user_alvo && args[0].raw.length === 18) // Usa o autor do comando como alvo em último caso
                user_alvo = message.author;
        
        for (const file of readdirSync(`./arquivos/data/rank/${message.guild.id}`)) {
            users.push(require(`../../arquivos/data/rank/${message.guild.id}/${file}`));
        }

        users.sort(function (a, b) {
            return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0);
        });

        users.sort();

        const usernames = [];
        const experiencias = [];
        const levels = [];

        const pages = users.length / 6;
        const paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages);

        if(users.length > 6)
            rodape = `( 1 | ${paginas} ) - ${paginas} ${diversao[8]["rodape"]}`.replace(".a", prefix);
        
        if(!user_alvo)
            if (args[0] && parseInt(args[0].raw) > 1) {
                if(paginas < parseInt(args[0].raw)) return message.reply(`:no_entry_sign: | ${diversao[8]["paginas"]}`);

                rodape = `( ${parseInt(args[0].raw)} | ${paginas} ) - ${paginas} ${diversao[8]["rodape"]}`.replace(".a", prefix);
                
                const remover = parseInt(args[0].raw) === paginas ? (parseInt(args[0].raw) - 1) * 6 : users.length % 6 !== 0 ? parseInt(args[0].raw) !== 2 ? (parseInt(args[0].raw) - 2) * 6 : (parseInt(args[0].raw) - 1) * 6 : (parseInt(args[0].raw) - 1) * 6 ;

                for(let x = 0; x < remover; x++){
                    users.shift();
                }
            }

        let i = 0;

        for (const user of users) {

            if(user_alvo)
                if(user.id === user_alvo.id){
                    usuario_alvo.push(user.xp);
                    break;
                }
            
            if (i < 6) {
                if (args[0] && args[0].type === "number" && parseInt(args[0].raw) !== 1)
                    usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\``);
                else
                    usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\``);
                
                experiencias.push(`\`${user.xp}\``);
                levels.push(`\`${Math.floor(user.xp / 1000)}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``);
            }

            if(!user_alvo) // Verifica se a entrada é um ID
                i++;
        }

        let embed, img_embed;

        if(!user_alvo){
            embed = new MessageEmbed()
            .setTitle(`${diversao[8]["rank_sv"]} ${message.guild.name}`)
            .setColor(0x29BB8E)
            .setDescription(`\`\`\`fix\n${diversao[8]["nivel_descricao"]} 🎉\n-----------------------\n   >✳️> 25X EXP <✳️<\`\`\``)
            .setFooter(rodape, message.author.avatarURL({dynamic: true}));

            embed.addField(`:christmas_tree: ${diversao[8]["enceirados"]}`, usernames.join("\n"), true);
            embed.addField(`:postal_horn: ${diversao[8]["experiencia"]}`, experiencias.join("\n"), true);
            embed.addField(`:beginner: ${diversao[8]["nivel"]}`, levels.join("\n"), true);

            img_embed = message.guild.iconURL({ size: 2048 }).replace(".webp", ".gif");
        }else{

            if(usuario_alvo.length === 0)
                usuario_alvo.push(0);

            embed = new MessageEmbed()
            .setTitle(user_alvo.username)
            .setColor(0x29BB8E)
            .setFooter(message.author.username, message.author.avatarURL({dynamic: true}));

            embed.addFields(
                { name: `:postal_horn: ${diversao[8]["experiencia"]}`, value: `\`${usuario_alvo[0]}\``, inline: true },
                { name: `:beginner: ${diversao[8]["nivel"]}`, value: `\`${parseInt(usuario_alvo[0] / 1000)}\` - \`${((usuario_alvo[0] % 1000) / 1000).toFixed(2)}%\``, inline: true },
                { name: "⠀", value: "⠀", inline: true}
            );

            img_embed = `https://cdn.discordapp.com/avatars/${user_alvo.id}/${user_alvo.avatar}.gif?size=512`;
        }

        fetch(img_embed).then(res => {
            if(res.status !== 200)
                img_embed = img_embed.replace('.gif', '.webp')

            embed.setThumbnail(img_embed);

            message.reply({ embeds: [embed] });
        });
    }
}