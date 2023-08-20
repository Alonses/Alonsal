const { SlashCommandBuilder } = require('discord.js')

const idiomasMap = {
    "al": ["al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`"],
    "de": ["de-de", ":flag_de: | Die Sprache wurde auf `Deutsch` geändert"],
    "en": ["en-us", ":flag_us: | Language switched to `American English`"],
    "es": ["es-es", ":flag_es: | Idioma cambiado a `Español`"],
    "fr": ["fr-fr", ":flag_fr: | Langue changée en `Français`"],
    "it": ["it-it", ":flag_it: | Lingua cambiata in `Italiano`"],
    "pt": ["pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`"],
    "ru": ["ru-ru", ":flag_ru: | Язык изменен на `русский`"]
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setNameLocalizations({
            "de": "sprache",
            "es-ES": 'idioma',
            "fr": 'langue',
            "it": 'linguaggio',
            "pt-BR": 'idioma',
            "ru": 'язык'
        })
        .setDescription("⌠👤⌡ Change the language of Alonsal")
        .setDescriptionLocalizations({
            "de": "⌠👤⌡ Alonsals Sprache ändern",
            "es-ES": '⌠👤⌡ Cambiar el idioma de Alonsal',
            "fr": '⌠👤⌡ Changer la langue d\'Alonsal',
            "it": '⌠👤⌡ Cambia la lingua di Alonsal',
            "pt-BR": '⌠👤⌡ Altere o idioma do Alonsal',
            "ru": '⌠👤⌡ Изменить язык Алонсала',
        })
        .addStringOption(option =>
            option.setName("language")
                .setNameLocalizations({
                    "de": 'sprache',
                    "es-ES": 'idioma',
                    "fr": 'langue',
                    "it": 'linguaggio',
                    "pt-BR": 'idioma',
                    "ru": 'язык'
                })
                .setDescription("What is the new language?")
                .setDescriptionLocalizations({
                    "de": 'Was ist die neue Sprache?',
                    "es-ES": '¿Cuál es el nuevo idioma?',
                    "fr": 'Quelle est la nouvelle langue?',
                    "it": 'Qual è la nuova lingua?',
                    "pt-BR": 'Qual o novo idioma?',
                    "ru": 'Каким будет новый язык?'
                })
                .addChoices(
                    { name: '🏴 Alonsês', value: 'al' },
                    { name: '🇩🇪 Deutsch', value: 'de' },
                    { name: '🇺🇸 English', value: 'en' },
                    { name: '🇪🇸 Español', value: 'es' },
                    { name: '🇫🇷 Français', value: 'fr' },
                    { name: '🇮🇹 Italiano', value: 'it' },
                    { name: '🇧🇷 Português', value: 'pt' },
                    { name: '🇷🇺 Русский', value: 'ru' }
                )
                .setRequired(true)),
    async execute(client, user, interaction) {

        let novo_idioma = interaction.options.getString("language")

        // Validando e coletando os dados do idioma
        const matches = novo_idioma.match(/al|de|en|es|fr|it|pt|ru/)

        // Resgata os dados do idioma válido
        user.lang = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]

        await user.save()
        interaction.reply({
            content: frase_idioma,
            ephemeral: true
        })
    }
}