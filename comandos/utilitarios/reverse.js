const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "reverso",
    description: "Inverta ou desinverta caracteres",
    aliases: [ "rev", "inverso", "reverter", "reverse" ],
    usage: "rev <suamensagem>",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        const { utilitarios } = require('../../arquivos/idiomas/'+  client.idioma.getLang(message.guild.id) +'.json');

        if(args.length > 0){
            let ordena = "";

            for(let x = 0; x < args.length; x++){
                ordena += args[x] + " ";
            }

            ordena = ordena.slice(0, -1).toLowerCase();

            let texto = ordena.split('');
            texto = texto.reverse();

            let texto_ordenado = "";
            for(let i = 0; i < texto.length; i++){
                texto_ordenado += texto[i];
            }

            const embed = new MessageEmbed()
                .setTitle(':arrow_backward: '+ utilitarios[5]["reverso"])
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
                .setColor(0x29BB8E)
                .setDescription("`" + texto_ordenado + "`");

            message.reply({ embeds: [embed] })
            .catch(() => {
                message.reply(":octagonal_sign: | "+ utilitarios[3]["error_1"]).then(message => message.delete({timeout: 5000}));
            });
        }else
            return message.reply(utilitarios[3]["aviso"]);
    }
};