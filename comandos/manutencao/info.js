module.exports = {
    name: "info",
    description: "Informações secundárias do alonsal",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const { MessageEmbed } = require('discord.js');
        const { version } = require('../../config.json');
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        emoji_rainha = client.emojis.cache.get(emojis.dancando_elizabeth).toString();
        emoji_bolo = client.emojis.cache.get(emojis.mc_bolo).toString();

        const embed = new MessageEmbed()
        .setTitle(manutencao[2]["infos"])
        .setColor(0x29BB8E)
        .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
        .setDescription( manutencao[2]["conteudo_1"].replaceAll(".a", prefix) +'\n'+ emoji_rainha +' '+ manutencao[2]["conteudo_2"].replaceAll(".a", prefix) +'\n'+ emoji_bolo +' '+ manutencao[2]["conteudo_3"].replaceAll(".a", prefix) +' '+ version + '_ ]')
        .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");

        message.channel.send(embed);
    }
};