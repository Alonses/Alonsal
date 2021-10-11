module.exports = {
    name: "servericon",
    description: "mostra o avatar do servidor",
    aliases: [ "svicon", "icon" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const fetch = require('node-fetch');
        const { MessageEmbed } = require("discord.js")

        let icone_server = message.guild.iconURL();
        icone_server = icone_server.replace(".webp", ".gif");

        fetch(icone_server)
        .then(res => {
            if(res.status != 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const embed = new MessageEmbed()
            .setTitle('Baixar a icone')
            .setURL(icone_server)
            .setColor(0x29BB8E)
            .setImage(icone_server);

            message.lineReply(embed);
        });
    }
}