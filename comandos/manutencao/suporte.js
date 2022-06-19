const { MessageEmbed } = require('discord.js');
const busca_emoji = require('../../adm/funcoes/busca_emoji');
const { emojis } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "suporte",
    description: "Dê suporte ao Alonsal",
    aliases: [ "support", "patrocinio", "money", "premium" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const vergonha = busca_emoji(client, emojis.vergonha);
        const bolo = busca_emoji(client, emojis.mc_bolo);

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle(`${manutencao[5]["apoie"]} ${bolo}`)
        .setURL("https://picpay.me/slondo")
        .setDescription(manutencao[5]["escaneie"])
        .setImage("https://i.imgur.com/incYvy2.jpg");

        const m = await message.channel.send(`${message.author} ${manutencao[5]["despachei"]} ${vergonha}`);
        await m.react('📫');

        client.users.cache.get(message.author.id).send({ embeds: [embed] });
    }
};