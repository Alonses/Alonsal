const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "git",
    description: "O repositório do Alonsal",
    aliases: [ "g", "repositorio", "repository" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setAuthor('GitHub')
        .setTitle(manutencao[1]["repositorio"])
        .setURL('https://github.com/brnd-21/Alonsal')
        .setImage('https://i.imgur.com/0tV3IQr.png')
        .setDescription(manutencao[1]["link"]);

        const m = await message.channel.send(`${message.author} `+ manutencao[1]["despachei"]);
        m.react('📫');

        client.users.cache.get(message.author.id).send({ embeds: [embed] });
    }
};