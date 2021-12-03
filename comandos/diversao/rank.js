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
        let range = 0;

        if (args[0] && args[0].type === "number") {
            range = args[0].value * 10 - 10;
        }

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const embed = new MessageEmbed()
            .setTitle(`${diversao[8]["rank_sv"]} ${message.guild.name}`)
            .setColor(0x29BB8E)
            .setDescription(`\`\`\`fix\n${diversao[8]["nivel_descricao"]} 🎉\n------------------------\n      >>>3X EXP<<<\`\`\``)
            .setFooter(message.author.username, message.author.avatarURL({dynamic: true}));

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

        for (const user of users) {
            usernames.push(`${medals[i] || ":medal:"} \`${user.nickname}\``);
            experiencias.push(`\`${user.xp}\``);
            levels.push(`\`${parseInt(user.xp / 1000)}\` - \`${((user.xp % 1000) / 1000).toFixed(2)}%\``);

            i++;
        }

        embed.addField(":christmas_tree: Enceirados", usernames.join("\n"), true);
        embed.addField(":postal_horn: Experiência", experiencias.join("\n"), true);
        embed.addField(":beginner: Nível", levels.join("\n"), true);

        let icone_server = message.guild.iconURL({ size: 2048 }).replace(".webp", ".gif");

        fetch(icone_server).then(res => {
            if(res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            embed.setThumbnail(icone_server);

            message.reply({ embeds: [embed] })
        });
    }
}