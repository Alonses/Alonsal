const { MessageEmbed } = require('discord.js');
const { version } = require('../../config.json');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');
const fs = require('fs');

module.exports = {
    name: "info",
    description: "Informações secundárias do alonsal",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        let qtd_comandos = "";

        const emoji_rainha = client.emojis.cache.get(emojis.dancando_elizabeth).toString();
        const emoji_bolo = client.emojis.cache.get(emojis.mc_bolo).toString();
        const emoji_dancante = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        fs.readFile('./arquivos/data/status/comandos.txt', 'utf8', function(err, data) {
            if (err) throw err;
            
            qtd_comandos = parseInt(data) + 1;

            const embed = new MessageEmbed()
            .setTitle(manutencao[2]["infos"])
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(`${manutencao[2]["conteudo_1"].replaceAll(".a", prefix)}\n${emoji_rainha} ${manutencao[2]["conteudo_2"].replaceAll(".a", prefix)}\n${emoji_bolo} ${manutencao[2]["conteudo_3"].replaceAll(".a", prefix)}\n\n${manutencao[2]["invocado_1"]} _${qtd_comandos.toLocaleString('pt-BR')}_ ${manutencao[2]["invocado_2"]} ${emoji_dancante}\n[ _${manutencao[2]["versao"]} ${version}_ ]`)
            .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");

            message.channel.send({ embeds: [embed] });
        });
    }
};