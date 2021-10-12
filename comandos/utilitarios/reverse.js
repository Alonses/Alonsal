module.exports = {
    name: "reverso",
    description: "Inverta ou desinverta caracteres",
    aliases: [ "rev", "inverso", "reverter", "reverse" ],
    usage: "rev <suamensagem>",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const { MessageEmbed } = require('discord.js');

        if(args.length > 0){
            let ordena = "";

            for(var x = 0; x < args.length; x++){
                ordena += args[x] + " ";
            }

            ordena = ordena.slice(0, -1).toLowerCase();

            let texto = ordena.split('');
            texto = texto.reverse();

            var texto_ordenado = "";
            for(var i = 0; i < texto.length; i++){
                texto_ordenado += texto[i];
            }

            const embed = new MessageEmbed()
                .setTitle(':arrow_backward: '+ utilitarios[5]["reverso"])
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic:true }))
                .setColor(0x29BB8E)
                .setDescription("`" + texto_ordenado + "`");

            message.lineReply(embed)
            .catch(() => {
                message.lineReply(":octagonal_sign: | "+ utilitarios[3]["error_1"]).then(message => message.delete({timeout: 5000}));
            });
        }else
            return message.lineReply(utilitarios[3]["aviso"]);
    }
};