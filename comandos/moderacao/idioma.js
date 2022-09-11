const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

const idiomasMap = {
    "pt": [ "pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`" ],
    "al": [ "al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`" ],
    "en": [ "en-us", ":flag_us: | Language switched to `American English`" ],
    "fr": [ "fr-fr", ":flag_fr: | Langue changée en `Français`" ]
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
        .setNameLocalizations({
            "pt-BR": 'idioma',
            "fr": 'langue'
        })
		.setDescription('⌠💂⌡ Change the language of Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Altere o idioma do Alonsal',
            "fr": '⌠💂⌡ Changer la langue d\'Alonsal'
        })
        .addStringOption(option =>
            option.setName('language')
                .setNameLocalizations({
                    "pt-BR": 'idioma',
                    "fr": 'langue'
                })
                .setDescription('pt, en, fr or al?')
                .setDescriptionLocalizations({
                    "pt-BR": 'pt, en, fr ou al?',
                    "fr": 'pt, en, fr ou al?'
                })
                .addChoices(
                    { name: 'Português', value: 'pt' },
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Alonsês', value: 'al' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
	async execute(client, interaction) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const membro_sv = interaction.guild.members.cache.get(interaction.user.id)

        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== "665002572926681128")
            return interaction.reply(moderacao[5]["moderadores"]) // Libera configuração para proprietários e adms apenas

        let novo_idioma = interaction.options.data[0].value

        // Coletando os dados do novo idioma
        const matches = novo_idioma.match(/pt|al|en|fr/)
        
        // Resgata os dados do idioma válido
        const sigla_idioma = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]
        const bandeira_idioma = frase_idioma.split(" ")[0]

        client.channels.cache.get('872865396200452127').send(`${bandeira_idioma} | Idioma do servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) atualizado para \`${sigla_idioma}\``)

        client.idioma.setLang(interaction.guild.id, sigla_idioma)
        interaction.reply({content: frase_idioma, ephemeral: true })
    }
}