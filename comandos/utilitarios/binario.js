const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "binario",
    description: "Codifique e decodifique do binário",
    aliases: [ "bn" ],
    cooldown: 3,
    usage: "bn <decode/encode> <text>",
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const {utilitarios} = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if (args.length < 2) return message.reply(utilitarios[3]["aviso"]);

        if (args[0] !== "encode" && args[0] !== "decode") return message.reply(utilitarios[3]["aviso"]);

        let operation = args[0];
        let embed;

        args.shift();
        
        switch (operation) {
            case "encode":
                embed = new MessageEmbed()
                    .setTitle(utilitarios[3]["codificado"])
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
                    .setColor(0x29BB8E)
                    .setDescription(`\`${textToBinary(args.join(' '))}\``);
                break;
            case "decode":
                let text = '';

                try {
                    text = binaryToText(args.join(' '));
                } catch (e) {
                    text = "invalid input"
                }

                embed = new MessageEmbed()
                    .setTitle(utilitarios[3]["decodificado"])
                    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
                    .setColor(0x29BB8E)
                    .setDescription(`\`${text}\``);
                break;
        }

        message.reply({embeds: [embed]}).catch(() => {
            message.reply(`:octagonal_sign: | ${utilitarios[3]["error_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
        });
    }
};

function textToBinary(str) {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

function binaryToText(str) {
    return str.split(" ").map(function(elem) {
        return String.fromCharCode(parseInt(elem, 2));
    }).join("")
}