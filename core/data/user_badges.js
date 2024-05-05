const { badge_ids } = require('../../files/json/text/emojis.json')
const { badgeTypes } = require('../formatters/patterns/user')

const badge_names = ["Tester", "Debugger", "Programmer", "Creator", "Waxed", "Donater", "Puler", "Rosquer", "Pionner", "Voter", "Reporter", "Bourgeois", "Chatterbox", "Sugestor", "Hoster"]

class Badge {
    constructor(id, name, emoji) {
        this.id = id
        this.name = name
        this.emoji = emoji
    }
}

class BadgeCollection {
    badges = []

    push(badge) {
        this.badges.push(badge)
    }

    build(client, badges) {
        return buildAllBadges(client, user, badges)
    }
}

function busca_badges(client, type, alvo) {

    // Retorna os dados de uma badge única
    if (type === badgeTypes.SINGLE)
        return new Badge(badge_ids[alvo], badge_names[alvo], client.emoji(badge_ids[alvo]))

    const all_badges = new BadgeCollection()

    // Buscando a badge fixada do usuário
    if (type === badgeTypes.FIXED) {
        const id = alvo.misc.fixed_badge
        if (!id) return null
        return new Badge(badge_ids[id], badge_names[id], client.emoji(badge_ids[id]))
    } else {

        // Listando todas as badges que o usuário possui
        const badges = client.getUserBadges(alvo.id)

        badges.forEach(valor => {
            all_badges.push(new Badge(badge_ids[valor.badge], badge_names[valor.badge], client.emoji(badge_ids[valor.badge])))
        })
    }

    return all_badges
}

async function buildAllBadges(client, user, badges) {
    let text = ""

    badges.forEach(item => {

        const id = item.badge
        const name = badge_names[id]
        const emoji = client.emoji(badge_ids[id])

        text += `${emoji} \`${name}\`, ${client.tls.phrase(user, "dive.badges.ganhou")} <t:${item.timestamp}:f>\n`
    })

    return text
}

module.exports = {
    busca_badges,
    buildAllBadges
}