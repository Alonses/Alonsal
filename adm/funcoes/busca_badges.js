const { existsSync } = require('fs')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('./busca_emoji.js')

module.exports = (client, modo, id_alvo, interaction) => {

    const user = {
        id: id_alvo,
        fixed_badge: null,
        badge_list: []
    }

    let all_badges = []
    const badges = [emojis.aln_tester, emojis.aln_debugger, emojis.aln_programmer, emojis.aln_creator, emojis.aln_waxed]
    const badge_names = ["Tester", "Debugger", "Programmer", "Creator", "Waxed"]

    if (modo == "single") // Retorna a badge bruta
        return [badges[id_alvo], badge_names[id_alvo]]

    if (existsSync(`./arquivos/data/badges/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}.json`)]
        const { fixed_badge, badge_list } = require(`../../arquivos/data/badges/${user.id}.json`)

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        user.fixed_badge = fixed_badge

        badge_list.forEach(valor => {
            let emoji_badge = busca_emoji(client, badges[parseInt(Object.keys(valor)[0])])

            // Listando todas as badges que o usuário possui
            if (modo == "fixed") { // Fixada
                if (fixed_badge == parseInt(Object.keys(valor)[0]))
                    all_badges.push(`${emoji_badge}`)
            } else // Listar todas
                all_badges.push(`${emoji_badge} \`${badge_names[parseInt(Object.keys(valor)[0])]}\`, ${diversao[9]["ganhou"]} <t:${Object.values(valor)[0]}:f>`)
        })
    }

    return all_badges.join("\n")
}