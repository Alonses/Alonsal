const { SlashCommandBuilder } = require('discord.js')

const idiomasMap = {
    "pt": ["pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`"],
    "al": ["al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`"],
    "en": ["en-us", ":flag_us: | Language switched to `American English`"],
    "fr": ["fr-fr", ":flag_fr: | Langue changée en `Français`"],
    "it": ["it-it", ":flag_it: | Lingua cambiata in `Italiano`"],
    "es": ["es-es", ":flag_es: | Idioma cambiado a `Español`"]
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setNameLocalizations({
            "pt-BR": 'idioma',
            "es-ES": 'idioma',
            "fr": 'langue',
            "it": 'lingua'
        })
        .setDescription('⌠👤⌡ Change the language of Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Altere o idioma do Alonsal',
            "es-ES": '⌠👤⌡ Cambiar el idioma de Alonsal',
            "fr": '⌠👤⌡ Changer la langue d\'Alonsal',
            "it": '⌠👤⌡ Cambia la lingua di Alonsal'
        })
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({
                    "pt-BR": 'idioma',
                    "es-ES": 'idioma',
                    "fr": 'langue',
                    "it": 'linguaggio'
                })
                .setDescription('What is the new language?')
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual o novo idioma?',
                    "es-ES": '¿Cuál es el nuevo idioma?',
                    "fr": 'Quelle est la nouvelle langue?',
                    "it": 'Qual è la nuova lingua?'
                })
                .addChoices(
                    { name: 'Alonsês', value: 'al' },
                    { name: 'English', value: 'en' },
                    { name: 'Español', value: 'es' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Italiano', value: 'it' },
                    { name: 'Português', value: 'pt' },
                )
                .setRequired(true)),
    async execute(client, user, interaction) {

        let novo_idioma = interaction.options.data[0].value

        // Validando e coletando os dados do idioma
        const matches = novo_idioma.match(/pt|al|en|es|fr|it/)

        // Resgata os dados do idioma válido
        user.lang = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]

        user.save()
        interaction.reply({ content: frase_idioma, ephemeral: true })
    }
}