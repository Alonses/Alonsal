const { readdirSync } = require("fs");
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

module.exports = {
    name: "rank",
    description: "Veja seu rank no servidor",
    aliases: [ "r" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const prefix = client.prefixManager.getPrefix(message.guild.id);

        let rodape = message.author.username;
        let users = [];

        for (const file of readdirSync(`./arquivos/data/rank/${message.guild.id}`)) {
            users.push(require(`../../arquivos/data/rank/${message.guild.id}/${file}`));
        }

        users.sort(function (a, b) {
            return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0);
        });

        users.sort();

        let usernames = [];
        let experiencias = [];
        let levels = [];
        let i = 0;

        if(users.length > 6)
            rodape = `( 1 | ${parseInt(users.length / 6) + 1} ) - ${parseInt(users.length / 6) + 1} ${diversao[8]["rodape"]}`.replace(".a", prefix);

        if (args[0] && args[0].type === "number"){
            if(users.length < (parseInt(args[0].value) - 1) * 6) return message.reply(`:no_entry_sign: | ${diversao[8]["paginas"]}`);

            rodape = `( ${parseInt(args[0].value)} | ${parseInt(users.length / 6) + 1} ) - ${parseInt(users.length / 6) + 1} ${diversao[8]["rodape"]}`.replace(".a", prefix);

            for(let x = 0; x < (parseInt(args[0].value) - 1) * 6; x++){
                users.shift();
            }
        }

        for (const user of users) {
            if(i < 6){
                if(args[0] && args[0].type === "number")
                    usernames.push(`:bust_in_silhouette: \`${(user.nickname).replace(/ /g, "")}\``);
                else
                    usernames.push(`${medals[i] || ":medal:"} \`${(user.nickname).replace(/ /g, "")}\``);
                
                experiencias.push(`\`${user.xp}\``);
                levels.push(`\`${parseInt(user.xp / 1000)}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``);
            }

            i++;
        }

        const embed = new MessageEmbed()
            .setTitle(`${diversao[8]["rank_sv"]} ${message.guild.name}`)
            .setColor(0x29BB8E)
            .setDescription(`\`\`\`fix\n${diversao[8]["nivel_descricao"]} 🎉\n-----------------------\n   >✳️> 5X EXP <✳️<\`\`\``)
            .setFooter(rodape, message.author.avatarURL({dynamic: true}));

        embed.addField(`:christmas_tree: ${diversao[8]["enceirados"]}`, usernames.join("\n"), true);
        embed.addField(`:postal_horn: ${diversao[8]["experiencia"]}`, experiencias.join("\n"), true);
        embed.addField(`:beginner: ${diversao[8]["nivel"]}`, levels.join("\n"), true);

        let icone_server = message.guild.iconURL({ size: 2048 }).replace(".webp", ".gif");

        fetch(icone_server).then(res => {
            if(res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            embed.setThumbnail(icone_server);

            message.reply({ embeds: [embed] })
        });
    }
}