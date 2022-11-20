const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { getUser } = require("../../adm/database/schemas/User.js");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { emojis_negativos } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('⌠💡⌡ Search for something on the wiki')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Pesquise sobre algo na wiki',
            "es-ES": '⌠💡⌡ Busca algo en la wiki',
            "fr": '⌠💡⌡ Rechercher quelque chose sur le wiki',
            "it": '⌠💡⌡ Cerca qualcosa sul wiki'
        })
        .addStringOption(option =>
            option.setName('search')
                .setNameLocalizations({
                    "pt-BR": 'pesquisa',
                    "es-ES": 'busqueda',
                    "fr": 'chercher',
                    "it": 'ricerca'
                })
                .setDescription('I\'m lucky')
                .setDescriptionLocalizations({
                    "pt-BR": 'Estou com sorte',
                    "es-ES": 'Estoy con suerte',
                    "fr": 'J\'ai de la chance',
                    "it": 'Sono fortunato'
                })
                .setRequired(true)),
    async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction) === "al-br" ? "pt-br" : client.idioma.getLang(interaction)
        const user = await getUser(interaction.user.id)
        const content = interaction.options.data[0].value

        if (content.includes("slondo")) // Pesquisa por slondo
            return client.tls.reply(client, interaction, "util.wiki.wiki_slondo")

        const emoji_nao_encontrado = busca_emoji(client, emojis_negativos)
        const url = `https://api.duckduckgo.com/?q=${encodeURI(content)}&format=json&pretty=0&skip_disambig=1&no_html=1`

        let counter = 0

        fetch(url, { headers: { "accept-language": idioma_definido } })
            .then(response => response.json())
            .then(async res => {

                const fields = []

                if (res.RelatedTopics.length > 0)
                    fields.push({ name: `:books: ${client.tls.phrase(client, interaction, "util.wiki_topicos_rel")}`, value: "\u200B" })

                for (const topic of res.RelatedTopics) {
                    counter++

                    const text = `${topic.Text.substr(0, 100)}...`

                    fields.push({
                        name: text,
                        value: topic.FirstURL,
                        inline: true
                    })

                    if (counter > 5)
                        break
                }

                if (res.Heading !== "") {
                    fields.length = fields.length > 5 ? 5 : fields.length

                    const Embed = new EmbedBuilder()
                        .setColor(user.misc.embed)
                        .setTitle(res.Heading)
                        .setAuthor({ name: res.AbstractSource })
                        .setDescription(res.AbstractText)
                        .setThumbnail(res.Image !== '' ? `https://api.duckduckgo.com${res.Image}` : 'https://cdn.iconscout.com/icon/free/png-256/duckduckgo-3-569238.png')
                        .addFields(fields)
                        .setTimestamp()
                        .setFooter({ text: 'DuckDuckGo API', iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setURL(res.AbstractURL)

                    interaction.reply({ embeds: [Embed] })
                } else {

                    const username = interaction.user.username, termo_pesquisado_cc = content.slice(1)

                    if (username.includes(termo_pesquisado_cc))
                        interaction.reply(`${emoji_nao_encontrado} | ${client.tls.phrase(client, interaction, "util.wiki.auto_pesquisa")} :v`)
                    else
                        interaction.reply(`${emoji_nao_encontrado} | ${client.tls.phrase(client, interaction, "util.wiki.sem_dados")} [ \`${content}\` ], ${client.tls.phrase(client, interaction, "util.minecraft.tente_novamente")}`)
                }
            })
            .catch(() => {
                interaction.reply(`${emoji_nao_encontrado} | ${client.tls.phrase(client, interaction, "util.wiki.sem_dados")} [ \`${content}\` ], ${client.tls.phrase(client, interaction, "util.minecraft.tente_novamente")}`)
            })
    }
}