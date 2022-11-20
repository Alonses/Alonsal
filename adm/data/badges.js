const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../discord/busca_emoji.js')
const { getUser } = require("../../adm/database/schemas/User.js");

const badge_ids = [emojis.aln_tester, emojis.aln_debugger, emojis.aln_programmer, emojis.aln_creator, emojis.aln_waxed, emojis.aln_donater, emojis.aln_puler, emojis.aln_rosquer]
const badge_names = ["Tester", "Debugger", "Programmer", "Creator", "Waxed", "Donater", "Puler", "Rosquer"]

module.exports.busca_badges = async (client, type, id_alvo) => {

    // Retorna a badge bruta
    if (type === badgeTypes.SINGLE) return new Badge(badge_ids[id_alvo], badge_names[id_alvo], busca_emoji(client, badge_ids[id_alvo]))

    const all_badges = new BadgeCollection();

    const user = await getUser(id_alvo);

        if (type === badgeTypes.FIXED) {
            const id = user.badges.fixed_badge;
            if (!id) return null;
                return new Badge(badge_ids[id], badge_names[id], busca_emoji(client, badge_ids[id]))
        } else if (user.badges.badge_list)
            user.badges.badge_list.forEach(valor => {
                const id = parseInt(Object.keys(valor)[0]);
                const emoji_badge = busca_emoji(client, badge_ids[id]);

                // Listando todas as badges que o usuário possui
                all_badges.push(new Badge(badge_ids[id], badge_names[id], emoji_badge))
            })


    return all_badges;
}

const badgeTypes = {
    SINGLE: 0,
    FIXED: 1,
    ALL: 2
}

async function buildAllBadges(client, interaction) {
    const id = interaction.user.id;
    const user = await getUser(id);

    let text = "";

    user.badges.badge_list.forEach(item => {
        const id = item.key;
        const name = badge_names[id];
        const emoji = busca_emoji(client, badge_ids[id]);

        text += `${emoji} \`${name}\`, ${client.tls.phrase(client, interaction, "dive.badges.ganhou")} <t:${item.value}:f>\n`
    });

    return text;
}

module.exports.badgeTypes = badgeTypes;
module.exports.buildAllBadges = buildAllBadges;

class Badge {
    constructor(id, name, emoji) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
    }
}

class BadgeCollection {
    badges = [];

    push(badge) {
        this.badges.push(badge);
    }

    build(client, interaction) {
        return buildAllBadges(client, interaction);
    }
}