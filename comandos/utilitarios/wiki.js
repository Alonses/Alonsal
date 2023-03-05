const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis_negativos } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription("⌠💡⌡ Search for something on the wiki")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Pesquise sobre algo na wiki',
            "es-ES": '⌠💡⌡ Busca algo en la wiki',
            "fr": '⌠💡⌡ Rechercher quelque chose sur le wiki',
            "it": '⌠💡⌡ Cerca qualcosa sul wiki',
            "ru": '⌠💡⌡ Ищите что-нибудь в вики'
        })
        .addStringOption(option =>
            option.setName("search")
                .setNameLocalizations({
                    "pt-BR": 'pesquisa',
                    "es-ES": 'busqueda',
                    "fr": 'chercher',
                    "it": 'ricerca',
                    "ru": 'поиск'
                })
                .setDescription("I'm lucky")
                .setDescriptionLocalizations({
                    "pt-BR": 'Estou com sorte',
                    "es-ES": 'Estoy con suerte',
                    "fr": 'J\'ai de la chance',
                    "it": 'Sono fortunato',
                    "ru": 'я удачлив'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName("language")
                .setNameLocalizations({
                    "pt-BR": 'idioma',
                    "es-ES": 'idioma',
                    "fr": 'langue',
                    "it": 'linguaggio',
                    "ru": 'язык'
                })
                .setDescription("In which language?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Em qual idioma?',
                    "es-ES": '¿En qué idioma?',
                    "fr": 'Dans quelle langue?',
                    "it": 'In quale lingua?',
                    "ru": 'На каком языке?'
                })
                .addChoices(
                    { name: 'English', value: 'en-us' },
                    { name: 'Español', value: 'es-es' },
                    { name: 'Français', value: 'fr-fr' },
                    { name: 'Italiano', value: 'it-it' },
                    { name: 'Português', value: 'pt-br' },
                    { name: 'Русский', value: 'ru-ru' }
                )),
    async execute(client, user, interaction) {

        let idioma_definido = user.lang === "al-br" ? "pt-br" : user.lang
        const content = interaction.options.data[0].value

        if (interaction.options.data.length > 1)
            idioma_definido = interaction.options.data[1].value

        if (content.includes("slondo")) // Pesquisa por slondo
            return client.tls.reply(interaction, user, "util.wiki.wiki_slondo")

        const url = `https://api.duckduckgo.com/?q=${encodeURI(content)}&format=json&pretty=0&skip_disambig=1&no_html=1`

        let counter = 0

        fetch(url, { headers: { "accept-language": idioma_definido } })
            .then(response => response.json())
            .then(async res => {

                const fields = []

                if (res.RelatedTopics.length > 0)
                    fields.push({ name: `:books: ${client.tls.phrase(user, "util.wiki.topicos_rel")}`, value: "\u200B" })

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
                        .setTitle(res.Heading)
                        .setURL(res.AbstractURL)
                        .setColor(client.embed_color(user.misc.color))
                        .setAuthor({ name: res.AbstractSource })
                        .setThumbnail(res.Image !== '' ? `https://api.duckduckgo.com${res.Image}` : 'https://cdn.iconscout.com/icon/free/png-256/duckduckgo-3-569238.png')
                        .addFields(fields)
                        .setDescription(res.AbstractText)
                        .setTimestamp()
                        .setFooter({ text: 'DuckDuckGo API', iconURL: interaction.user.avatarURL({ dynamic: true }) })

                    interaction.reply({ embeds: [Embed], ephemeral: user?.conf.ghost_mode || false })
                } else {

                    const username = interaction.user.username, termo_pesquisado_cc = content.slice(1)

                    if (username.includes(termo_pesquisado_cc))
                        interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.wiki.auto_pesquisa")} :v`, ephemeral: user?.conf.ghost_mode || false })
                    else
                        interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.wiki.sem_dados")} [ \`${content}\` ], ${client.tls.phrase(user, "util.minecraft.tente_novamente")}`, ephemeral: user?.conf.ghost_mode || false })
                }
            })
            .catch(() => interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.wiki.sem_dados")} [ \`${content}\` ], ${client.tls.phrase(user, "util.minecraft.tente_novamente")}`, ephemeral: true }))
    }
}