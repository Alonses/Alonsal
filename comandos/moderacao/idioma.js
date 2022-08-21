const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

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
                )),
	async execute(client, interaction) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        if (!interaction.member.permissions.has('MANAGE_GUILD') && !client.owners.includes(interaction.user.id))
            return interaction.reply(`:octagonal_sign: | ${moderacao[3]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000)) // Libera configuração para o Slondo e adms apenas

        let matches, novo_idioma
        
        if(interaction.options.data.length > 0){
            novo_idioma = interaction.options.data[0].value

            // Verifica se o idioma é válido
            matches = novo_idioma.match(/pt|al|en|fr/)
        }

        if(matches == null || interaction.options.data.length < 1){ // Retorna a lista de idiomas válidos
            embed_idiomas = new EmbedBuilder()
            .setTitle(moderacao[0]["titulo_idioma"])
            .setColor(0x29BB8E)
            .setDescription(":flag_br: `.alang pt` - Português\n:pirate_flag: `.alang al` - Alonsês\n:flag_us: `.alang en` - English\n:flag_fr: `.alang fr` - Français")
            
            return interaction.reply({embeds: [embed_idiomas], ephemeral: true})
        }
        
        // Resgata os dados do idioma válido
        const sigla_idioma = idiomasMap[matches[0]][0]
        const frase_idioma = idiomasMap[matches[0]][1]
        const bandeira_idioma = frase_idioma.split(" ")[0]

        client.channels.cache.get('872865396200452127').send(`${bandeira_idioma} | Idioma do servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) atualizado para \`${sigla_idioma}\``)

        client.idioma.setLang(interaction.guild.id, sigla_idioma)
        interaction.reply(frase_idioma)
    }
}