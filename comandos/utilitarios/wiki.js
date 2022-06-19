const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const busca_emoji = require('../../adm/funcoes/busca_emoji');
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "wiki",
    description: "Pesquisa sobre algo na wiki",
    aliases: [ "w", "buscar", "busca", "search", "wikipedia" ],
    usage: "w Slondo",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        let counter = 0;
        const content = args.join(" ").toLowerCase();

        if(content.includes("slondo")) // Pesquisa por slondo
            return message.reply(utilitarios[1]["wiki_slondo"]);

        const emoji_nao_encontrado = busca_emoji(client, emojis_negativos);

        if(args.length > 0){
            const url = `https://api.duckduckgo.com/?q=${encodeURI(content)}&format=json&pretty=0&skip_disambig=1&no_html=1`;

            const termo_pesquisado_cc = content.slice(1);
            const username = message.author.username;
            
            fetch(url, { headers:{ "accept-language": client.idioma.getLang(message.guild.id) }})
            .then(response => response.json())
            .then(async res => {
            
            const fields = [];
            
            if(res.RelatedTopics.length > 0)
                fields.push({ name: `:books: ${utilitarios[1]["topicos_rel"]}`, value: "\u200B" });

            for(const topic of res.RelatedTopics){
                counter++;

                const text = `${topic.Text.substr(0, 100)}...`;

                fields.push({
                    name: text,
                    value: topic.FirstURL,
                    inline: true
                });

                if(counter > 5)
                    break;
            }

            if(res.Heading !== ""){
                fields.length = fields.length > 5 ? 5 : fields.length

                const Embed = new MessageEmbed()
                .setColor(0x29BB8E)
                .setTitle(res.Heading)
                .setAuthor(res.AbstractSource)
                .setDescription(res.AbstractText)
                .setThumbnail(res.Image !== '' ? `https://api.duckduckgo.com${res.Image}` : 'https://cdn.iconscout.com/icon/free/png-256/duckduckgo-3-569238.png')
                .addFields(fields)
                .setTimestamp()
                .setFooter('DuckDuckGo API', message.author.avatarURL({dynamic:true}))
                .setURL(res.AbstractURL);

                message.reply({ embeds: [Embed] });
            }else
                if(username.includes(termo_pesquisado_cc))
                    message.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["auto_pesquisa"]} :v`);
                else
                    message.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["sem_dados"]} [ \`${content}\` ], ${utilitarios[9]["tente_novamente"]}`);
            })
            .catch(() => {
                message.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["sem_dados"]} [ \`${content}\` ], ${utilitarios[9]["tente_novamente"]}`);
            });
        }
    }
};