const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "servericon",
    description: "mostra o avatar do servidor",
    aliases: [ "svicon", "icon" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let icone_server = message.guild.iconURL({ size: 2048 });
        icone_server = icone_server.replace(".webp", ".gif");

        fetch(icone_server)
        .then(res => {
            if(res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const embed = new MessageEmbed()
            .setAuthor(message.guild.name)
            .setTitle(utilitarios[4]["baixar_icone"])
            .setURL(icone_server)
            .setColor(0x29BB8E)
            .setImage(icone_server);

            message.reply({ embeds: [embed] });
        });
    }
}