const { SlashCommandBuilder } = require('discord.js')
const { existsSync, writeFileSync } = require('fs')

const busca_badges = require('../../adm/funcoes/busca_badges.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('badge')
		.setDescription('⌠👤⌡ (Des)Fixe suas badges!')
        .addSubcommand(subcommand =>
            subcommand.setName('fixar')
                .setDescription('⌠👤⌡ Fixe uma badge ao seu perfil')
                .addStringOption(option =>
                option.setName('fixar')
                    .setDescription('Qual vai fixar?')
                    .addChoices(
                        { name: 'Tester', value: '0' },
                        { name: 'Debugger', value: '1' },
                        { name: 'Programmer', value: '2' },
                        { name: 'Creator', value: '3' },
                        { name: 'Waxed', value: '4' }
                    )
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remover')
            .setDescription('⌠👤⌡ Remover a badge do fixado')),
	async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        // Validando existência de badges antes do comando
        if (!existsSync(`./arquivos/data/badges/${interaction.user.id}/badges.json`))
            return interaction.reply({ content: `:mag: | ${diversao[9]["error_1"]}`, ephemeral: true })

        let entrada = interaction.options.data[0].options, new_badge = ""

        entrada.forEach(valor => {
            if (valor.name == "fixar")
                new_badge = parseInt(valor.value)
        })
        
        const user = {
            id: interaction.user.id,
            badge: null,
            fixed_badge: null,
            badge_list: []
        }
        
        let all_badges = []

        delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}/badges.json`)]
        const { badge_list } = require(`../../arquivos/data/badges/${user.id}/badges.json`)

        badge_list.forEach(valor => {
            all_badges.push(parseInt(Object.keys(valor)[0]))
            
            if (new_badge == parseInt(Object.keys(valor)[0]))
                emoji_badge = busca_emoji(client, busca_badges(client, 'single', parseInt(Object.keys(valor)[0]))[0])
        })
        
        console.log(all_badges, new_badge)

        // Verificando se o usuário possui a badge informada
        if (!all_badges.includes(new_badge) && interaction.options.getSubcommand() == "fixar" ) 
            return interaction.reply({ content: `:octagonal_sign: | ${diversao[9]["error_2"]}`, ephemeral: true })

        const nome_badge = busca_badges(client, 'single', parseInt(new_badge))[1]
        
        // Salvando os dados novamente para a reescrita
        if (interaction.options.getSubcommand() == "fixar")
            user.fixed_badge = new_badge
        else
            user.fixed_badge = null

        user.badge_list = badge_list

        writeFileSync(`./arquivos/data/badges/${user.id}/badges.json`, JSON.stringify(user))
        delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}/badges.json`)]

        if (interaction.options.getSubcommand() == "fixar")
            interaction.reply({ content: `${emoji_badge} | Badge \`${nome_badge}\` ${diversao[9]["badge_fixada"]}`, ephemeral: true })
        else // Removendo a badge fixada
            interaction.reply({ content: `:medal: | Badge ${diversao[9]["badge_removida"]}`, ephemeral: true })
    }
}