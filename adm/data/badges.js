const { existsSync } = require('fs')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../discord/busca_emoji.js')

module.exports = (client, modo, id_alvo, interaction) => {

    const user = {
        id: id_alvo,
        fixed_badge: null,
        badge_list: []
    }

    const badges = [emojis.aln_tester, emojis.aln_debugger, emojis.aln_programmer, emojis.aln_creator, emojis.aln_waxed, emojis.aln_donater, emojis.aln_puler, emojis.aln_rosquer]
    const badge_names = ["Tester", "Debugger", "Programmer", "Creator", "Waxed", "Donater", "Puler", "Rosquer"]

    if (modo == "single") // Retorna a badge bruta
        return [badges[id_alvo], badge_names[id_alvo]]

    let all_badges = []

    if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
        const { fixed_badge, badge_list } = require(`../../arquivos/data/user/${user.id}.json`)
        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        user.fixed_badge = fixed_badge

        if (badge_list)
            badge_list.forEach(valor => {
                let emoji_badge = busca_emoji(client, badges[parseInt(Object.keys(valor)[0])])

                // Listando todas as badges que o usuário possui
                if (modo == "fixed") { // Fixada
                    if (fixed_badge == parseInt(Object.keys(valor)[0]))
                        all_badges.push(`${emoji_badge}`)
                } else // Listando todas
                    all_badges.push(`${emoji_badge} \`${badge_names[parseInt(Object.keys(valor)[0])]}\`, ${diversao[9]["ganhou"]} <t:${Object.values(valor)[0]}:f>`)
            })
    }

    return all_badges.join("\n")
}