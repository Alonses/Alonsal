const { MessageEmbed } = require("discord.js");
const { emojis } = require('../../arquivos/json/text/emojis.json');
const busca_emoji = require('../../adm/funcoes/busca_emoji.js');

module.exports = {
    name: "botemojis",
    description: "Lista todos os emojis registrados no bot",
    aliases: [ "cemojis" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {
    
        if (!client.owners.includes(message.author.id)) return;
        
        let emojis_registrados = "", i = 0;
        let emojis_registrados_2 = "";

        Object.keys(emojis).forEach(emoji => {
            if(emojis_registrados.length < 2000){
                if(i % 9 == 0)
                    emojis_registrados += "\n";

                emojis_registrados += busca_emoji(client, emojis[emoji]);
            }else{
                if(emojis_registrados_2.length < 2000){
                    if(i % 9 == 0)
                        emojis_registrados_2 += "\n";

                    emojis_registrados_2 += busca_emoji(client, emojis[emoji]);
                }
            }

            i++;
        });

        const emojis_global = new MessageEmbed()
        .setTitle("Todos os emojis registrados")
        .setColor(0x29BB8E)
        .setDescription(`${emojis_registrados}`)
        .setFooter(`Quantidade: ${Object.keys(emojis).length}`);

        message.reply({embeds: [emojis_global]});

        if(emojis_registrados_2.length > 0){
            const emojis_global2 = new MessageEmbed()
            .setTitle("Todos os emojis registrados")
            .setColor(0x29BB8E)
            .setDescription(`${emojis_registrados_2}`)
            .setFooter(`Quantidade: ${Object.keys(emojis).length}`);

            message.reply({embeds: [emojis_global2]});
        }
    }
}