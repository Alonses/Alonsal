const {MessageEmbed} = require('discord.js');
const binario = require('../../arquivos/json/text/binario.json');

module.exports = {
    name: "binario",
    description: "Codifique e decodifique do binário",
    aliases: [ "bn" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const {utilitarios} = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if (args.length < 1) return message.reply(utilitarios[3]["aviso_1"]);

        if (args[0].raw !== "encode" && args[0].raw !== "decode") return message.reply(utilitarios[3]["aviso_2"]);

        let embed;
        const operacao = args[0].raw;
        args.shift();

        switch (operacao) {
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

                let msg_titulo = utilitarios[3]["decodificado"];
                // Confirma que a operação não resultou em uma string vazia
                if(text.replaceAll("\x00", "").length < 1){
                    text = utilitarios[3]["resul_vazio"]; 
                    msg_titulo = utilitarios[3]["titulo_vazio"] 
                }

                embed = new MessageEmbed()
                    .setTitle(msg_titulo)
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
        return binario[char];
    }).join(' ');
}

function binaryToText(str) {
    return str.split(" ").map(function(elem) {
        return Object.keys(binario).find(key => binario[key] === elem);
    }).join("")
}