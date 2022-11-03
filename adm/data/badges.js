const { existsSync } = require('fs')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../discord/busca_emoji.js')

module.exports = (client, modo, id_alvo, interaction) => {

    const badge_ids = [emojis.aln_tester, emojis.aln_debugger, emojis.aln_programmer, emojis.aln_creator, emojis.aln_waxed, emojis.aln_donater, emojis.aln_puler, emojis.aln_rosquer]
    const badge_names = ["Tester", "Debugger", "Programmer", "Creator", "Waxed", "Donater", "Puler", "Rosquer"]

    if (modo == "single") // Retorna a badge bruta
        return [badge_ids[id_alvo], badge_names[id_alvo]]

    let all_badges = []

    if (existsSync(`./arquivos/data/user/${id_alvo}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/user/${id_alvo}.json`)]
        const { badges } = require(`../../arquivos/data/user/${id_alvo}.json`)

        if (badges.badge_list)
            badges.badge_list.forEach(valor => {
                let emoji_badge = busca_emoji(client, badge_ids[parseInt(Object.keys(valor)[0])])

                // Listando todas as badges que o usuário possui
                if (modo == "fixed") { // Fixada
                    if (badges.fixed_badge == parseInt(Object.keys(valor)[0]))
                        all_badges.push(`${emoji_badge}`)
                } else // Listando todas
                    all_badges.push(`${emoji_badge} \`${badge_names[parseInt(Object.keys(valor)[0])]}\`, ${client.tls.phrase(client, interaction, "dive.badges.ganhou")} <t:${Object.values(valor)[0]}:f>`)
            })
    }

    return all_badges.join("\n")
}