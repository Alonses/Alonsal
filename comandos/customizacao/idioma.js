const { SlashCommandBuilder } = require('discord.js')

const idiomasMap = {
    "pt": ["pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`"],
    "al": ["al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`"],
    "en": ["en-us", ":flag_us: | Language switched to `American English`"],
    "fr": ["fr-fr", ":flag_fr: | Langue changée en `Français`"],
    "es": ["es-es", ":flag_es: | Idioma cambiado a `Español`"]
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setNameLocalizations({
            "pt-BR": 'idioma',
            "es-ES": 'idioma',
            "fr": 'langue'
        })
        .setDescription('⌠👤⌡ Change the language of Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Altere o idioma do Alonsal',
            "es-ES": '⌠👤⌡ Cambiar el idioma de Alonsal',
            "fr": '⌠👤⌡ Changer la langue d\'Alonsal'
        })
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({
                    "pt-BR": 'idioma',
                    "es-ES": 'idioma',
                    "fr": 'langue'
                })
                .setDescription('What is the new language?')
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual o novo idioma?',
                    "es-ES": '¿Cuál es el nuevo idioma?',
                    "fr": 'Quelle est la nouvelle langue ?'
                })
                .addChoices(
                    { name: 'Alonsês', value: 'al' },
                    { name: 'English', value: 'en' },
                    { name: 'Español', value: 'es' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Português', value: 'pt' },
                )
                .setRequired(true)),
    async execute(client, interaction) {

        let novo_idioma = interaction.options.data[0].value

        // Validando/ coletando os dados do idioma
        const matches = novo_idioma.match(/pt|al|en|es|fr/)

        // Resgata os dados do idioma válido
        const sigla_idioma = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]

        client.idioma.setLang(client, interaction, sigla_idioma)
        interaction.reply({ content: frase_idioma, ephemeral: true })
    }
}