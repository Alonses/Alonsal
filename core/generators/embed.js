const { EmbedBuilder } = require('discord.js')

function create_embed({ client, alvo, data }) {

    const embed = new EmbedBuilder()
        .setTitle(data.title?.tls ? client.tls.phrase(alvo, data.title.tls, data.title?.emoji, data.title?.replace) : data.title)
        .setColor(client.embed_color(data?.color || alvo?.misc?.embed_color || "turquesa"))

    if (data?.description)
        embed.setDescription(data.description?.tls ? client.tls.phrase(alvo, data.description.tls, data.description?.emoji, data.description?.replace) : data.description)

    if (data?.footer) {

        const footer = { text: data.footer?.text?.tls ? client.tls.phrase(alvo, data.footer.text.tls, data.footer?.text?.emoji, data.footer?.text?.replace) : data.footer?.text || data.footer }

        if (data.footer?.iconURL)
            footer.iconURL = data.footer.iconURL

        embed.setFooter(footer)
    }

    if (data?.author) {

        const author = { name: data.author.name }

        if (data.author?.url)
            author.url = data.author.url

        if (data.author?.iconURL)
            author.iconURL = data.author.iconURL

        embed.setAuthor(author)
    }

    if (data?.image)
        embed.setImage(data.image)

    if (data?.thumbnail)
        embed.setThumbnail(data.thumbnail)

    if (data?.timestamp)
        embed.setTimestamp()

    if (data?.fields) {

        const fields = data.fields
        fields.forEach(field => {

            if (field.name?.tls)
                field.name = client.tls.phrase(alvo, field.name.tls, field.name?.emoji, field.name?.replace)

            embed.addFields(field)
        })
    }

    return embed
}

module.exports.create_embed = create_embed