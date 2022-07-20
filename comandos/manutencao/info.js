const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../config.json');
const busca_emoji = require('../../adm/funcoes/busca_emoji');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "info",
    description: "Informações secundárias do alonsal",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {

        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        let qtd_comandos = "";

        const emoji_rainha = busca_emoji(client, emojis.dancando_elizabeth);
        const emoji_bolo = busca_emoji(client, emojis.mc_bolo);
        const emoji_dancante = busca_emoji(client, emojis_dancantes);

        fs.readFile('./arquivos/data/contador/comandos.txt', 'utf8', function(err, data) {
            if (err) throw err;
            
            qtd_comandos = parseInt(data) + 1;

            const embed = new MessageEmbed()
            .setTitle(manutencao[2]["infos"])
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(`${manutencao[2]["conteudo_1"].replaceAll(".a", prefix)}\n${emoji_rainha} ${manutencao[2]["conteudo_2"].replaceAll(".a", prefix)}\n${emoji_bolo} ${manutencao[2]["conteudo_3"].replaceAll(".a", prefix)}\n\n${manutencao[2]["invocado_1"]} \`${qtd_comandos.toLocaleString('pt-BR')}\` ${manutencao[2]["invocado_2"]} ${emoji_dancante}\n[ _${manutencao[2]["versao"]} ${version}_ ]\n\n${manutencao[2]["spawn_alonsal"]} <t:1618756500>`)
            .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");

            message.channel.send({ embeds: [embed] });
        });
    }
};