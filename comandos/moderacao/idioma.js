const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

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
        .setDescription('⌠💂⌡ Change the language of Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Altere o idioma do Alonsal',
            "es-ES": '⌠💂⌡ Cambiar el idioma de Alonsal',
            "fr": '⌠💂⌡ Changer la langue d\'Alonsal'
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
                    { name: 'Português', value: 'pt' },
                    { name: 'English', value: 'en' },
                    { name: 'Español', value: 'es' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Alonsês', value: 'al' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== "665002572926681128")
            return interaction.reply({ content: moderacao[5]["moderadores"], ephemeral: true }) // Libera configuração para proprietários e adms apenas

        let novo_idioma = interaction.options.data[0].value

        // Validando/ coletando os dados do idioma
        const matches = novo_idioma.match(/pt|al|en|es|fr/)

        // Resgata os dados do idioma válido
        const sigla_idioma = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]
        const bandeira_idioma = frase_idioma.split(" ")[0]

        client.channels.cache.get('872865396200452127').send(`${bandeira_idioma} | Idioma do servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) atualizado para \`${sigla_idioma}\``)

        client.idioma.setLang(interaction.guild.id, sigla_idioma)
        interaction.reply({ content: frase_idioma, ephemeral: true })
    }
}