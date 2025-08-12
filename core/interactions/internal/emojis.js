const { aliases } = require('../../../files/json/text/emojis.json')

module.exports = async ({ client, interaction }) => {

    let emojis_registrados = "", cache_emojis = []

    Object.keys(aliases).forEach(emoji => {
        cache_emojis.push(aliases[emoji])
    })

    cache_emojis = client.shuffleArray(cache_emojis)

    for (let i = 0; i < cache_emojis.length; i++) {
        if ((emojis_registrados + client.emoji(cache_emojis[i])).length < 2000) {
            if (i % 9 === 0) emojis_registrados += "\n"

            emojis_registrados += client.emoji(cache_emojis[i])
        }
    }

    const emojis_global = client.create_embed({
        title: "> Alguns emojis salvos",
        color: "turquesa",
        description: emojis_registrados,
        footer: `Emojis registrados: ${Object.keys(aliases).length}`
    })

    const row = client.create_buttons([
        { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" }
    ], interaction)

    interaction.update({
        embeds: [emojis_global],
        components: [row],
        flags: "Ephemeral"
    })
}