const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const idiomasMap = {
    "pt": [ "pt-br", ":flag_br: | Idioma alterado para `Português Brasileiro`" ],
    "al": [ "al-br", ":pirate_flag: | Meu idioma agora é o `Alonsês`" ],
    "en": [ "en-us", ":flag_us: | Language switched to `American English`" ],
    "fr": [ "fr-fr", ":flag_fr: | Langue changée en `Français`" ]
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('idioma')
		.setDescription('⌠💂⌡ Altere o idioma do Alonsal')
        .addStringOption(option =>
            option.setName('idioma')
                .setDescription('pt, en, fr ou al?')
                .addChoices(
                    { name: 'Português', value: 'pt' },
                    { name: 'English', value: 'en' },
                    { name: 'Français', value: 'fr' },
                    { name: 'Alonsês', value: 'al' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageChannels),
	async execute(client, interaction) {

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