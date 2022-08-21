const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/funcoes/busca_emoji')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('⌠💡⌡ Pesquise sobre algo na wiki')
        .addStringOption(option =>
            option.setName('pesquisa')
                .setDescription('Estou com sorte')
                .setRequired(true)),
	async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction) == "al-br" ? "pt-br" : client.idioma.getLang(interaction)
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let counter = 0
        const content = interaction.options.data[0].value

        if(content.includes("slondo")) // Pesquisa por slondo
            return interaction.reply(utilitarios[1]["wiki_slondo"])

        const emoji_nao_encontrado = busca_emoji(client, emojis_negativos)
        const url = `https://api.duckduckgo.com/?q=${encodeURI(content)}&format=json&pretty=0&skip_disambig=1&no_html=1`

        const termo_pesquisado_cc = content.slice(1)
        const username = interaction.user.username
        
        fetch(url, { headers:{ "accept-language": idioma_definido }})
        .then(response => response.json())
        .then(async res => {
        
        const fields = []
        
        if(res.RelatedTopics.length > 0)
            fields.push({ name: `:books: ${utilitarios[1]["topicos_rel"]}`, value: "\u200B" })

        for(const topic of res.RelatedTopics){
            counter++

            const text = `${topic.Text.substr(0, 100)}...`

            fields.push({
                name: text,
                value: topic.FirstURL,
                inline: true
            })

            if(counter > 5)
                break
        }

        if(res.Heading !== ""){
            fields.length = fields.length > 5 ? 5 : fields.length
            
            const Embed = new EmbedBuilder()
            .setColor(0x29BB8E)
            .setTitle(res.Heading)
            .setAuthor({ name: res.AbstractSource })
            .setDescription(res.AbstractText)
            .setThumbnail(res.Image !== '' ? `https://api.duckduckgo.com${res.Image}` : 'https://cdn.iconscout.com/icon/free/png-256/duckduckgo-3-569238.png')
            .addFields(fields)
            .setTimestamp()
            .setFooter({ text: 'DuckDuckGo API', iconURL: interaction.user.avatarURL({ dynamic:true }) })
            .setURL(res.AbstractURL)

            interaction.reply({ embeds: [Embed] })
        }else
            if(username.includes(termo_pesquisado_cc))
                interaction.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["auto_pesquisa"]} :v`)
            else
                interaction.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["sem_dados"]} [ \`${content}\` ], ${utilitarios[9]["tente_novamente"]}`)
        })
        .catch(() => {
            interaction.reply(`${emoji_nao_encontrado} | ${utilitarios[1]["sem_dados"]} [ \`${content}\` ], ${utilitarios[9]["tente_novamente"]}`)
        })
    }
}