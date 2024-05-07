// Relação de dias
// 0 -> Dias úteis
// 1 -> Finais de semana
// 2 -> Todo dia

// 4 -> Domingo
// 5 -> Segunda
// 6 -> Terça
// 7 -> Quarta
// 8 -> Quinta
// 9 -> Sexta
// 10 -> Sábado

const moduleDays = {
    0: "🏭",
    1: "🛹",
    2: "📆",
    4: "🛵",
    5: "💀",
    6: "🤡",
    7: "🐸",
    8: "🚀",
    9: "🍺",
    10: "🕺"
}

const modulePrices = {
    3: 1,
    4: 1,
    5: 5,
    6: 10
}

const week_days = {
    0: [1, 2, 3, 4, 5],
    1: [6, 0]
}

const colorsMap = {
    "red": ["D62D20", 1, "🎈"],
    "brown": ["66401D", 1, "🐶"],
    "orange": ["F27D0C", 1, "🎃"],
    "yellow": ["FFD319", 1, "🎁"],
    "green": ["36802D", 1, "🎄"],
    "blue": ["7289DA", 1, "💎"],
    "cyan": ["29BB8E", 1, "🧪"],
    "purple": ["44008B", 1, "🔮"],
    "magenta": ["FF2EF1", 1, "🌸"],
    "white": ["FFFFFF", 2, "🧻"],
    "gray": ["2D2D31", 2, "🛒"],
    "black": ["000000", 2, "🎮"],
    "random": ["random", 3, "💥"]
}

const colorsPriceMap = {
    0: 200,
    1: 300,
    2: 400,
    3: 500,
    4: 50
}

const badges = {
    TESTER: 0,
    DEBUGGER: 1,
    PROGRAMMER: 2,
    CREATOR: 3,
    WAXED: 4,
    DONATER: 5,
    PULER: 6,
    ROSQUER: 7,
    PIONNER: 8,
    VOTER: 9,
    REPORTER: 10,
    BOURGEOIS: 11,
    CHATTERBOX: 12,
    SUGESTOR: 13,
    HOSTER: 14
}

const badgeTypes = {
    SINGLE: 0,
    FIXED: 1,
    ALL: 2
}

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

const CHECKS = {
    LIMIT: 5,
    DIFF: 7000,
    HOLD: 60000
}

const idiomas = {
    "de": "alemão",
    "nl": "holândes",
    "se": "sueco",
    "tr": "turco",
    "jp": "japonês"
}

const languagesMap = {
    "al": ["al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`", "Alonsês", "🏴‍☠️"],
    "de": ["de-de", ":flag_de: | Die Sprache wurde auf `Deutsch` geändert", "Deutsch", "🇩🇪"],
    "en": ["en-us", ":flag_us: | Language switched to `American English`", "American English", "🇺🇸"],
    "es": ["es-es", ":flag_es: | Idioma cambiado a `Español`", "Español", "🇪🇸"],
    "fr": ["fr-fr", ":flag_fr: | Langue changée en `Français`", "Français", "🇫🇷"],
    "hp": ["pt-hp", ":sunny: | \`Hopês\` agora tá ativo komo segundino idioma!", "Hopês", "🔆"],
    "it": ["it-it", ":flag_it: | Lingua cambiata in `Italiano`", "Italiano", "🇮🇹"],
    "pt": ["pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`", "Português Brasileiro", "🇧🇷"],
    "ru": ["ru-ru", ":flag_ru: | Язык изменен на `русский`", "русский", "🇷🇺"]
}

const operations = {
    0: ["conf", "ghost_mode"],
    1: ["conf", "notify"],
    2: ["conf", "ranking"],
    3: ["conf", "public_badges"],
    4: ["misc", "weather"],
    5: ["conf", "global_tasks"],
    6: ["conf", "resumed"],
    7: ["conf", "cached_guilds"]
}

const dataComboRelation = {
    "1": [1, 2],
    "2": [3, 4],
    "3": [5, 6, 7],
    "4": [8, 9],
    "5": [10],
    "6": [11]
}

module.exports = {
    moduleDays,
    modulePrices,
    week_days,
    colorsMap,
    colorsPriceMap,
    badges,
    badgeTypes,
    medals,
    CHECKS,
    idiomas,
    languagesMap,
    operations,
    dataComboRelation
}