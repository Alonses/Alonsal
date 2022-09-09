const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { existsSync, writeFileSync } = require('fs')

const busca_badges = require('../../adm/funcoes/busca_badges.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('badges')
		.setDescription('⌠😂⌡ Veja e fixe suas badges!')
        .addStringOption(option =>
            option.setName('fixar')
                .setDescription('Qual vai fixar?')
                .addChoices(
                    { name: 'Tester', value: '0' },
                    { name: 'Debugger', value: '1' },
                    { name: 'Programmer', value: '2' },
                    { name: 'Waxed', value: '4' }
                )),
	async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        // Procurando pelas badges antes do comando
        if (!existsSync(`./arquivos/data/badges/${interaction.user.id}/badges.json`))
            interaction.reply({ content: diversao[9]["error_1"], ephemeral: true })
        
        if (!interaction.options.data[0]) {

            const embed = new EmbedBuilder()
            .setTitle(`> ${diversao[9]["suas_badges"]}`)
            .setColor(0x29BB8E)
            .setDescription(busca_badges(client, 'all', interaction.user.id))
            .setFooter({ text: diversao[9]["rodape"]})

            interaction.reply({ embeds: [embed], ephemeral: true })
        } else { // Fixando a badge ao perfil do usuário

            const new_badge = parseInt(interaction.options.data[0].value)
            
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
            
            // Verificando se o usuário possui a badge informada
            if(!all_badges.includes(new_badge)) return interaction.reply({ content: diversao[9]["error_2"], ephemeral: true })

            const nome_badge = busca_badges(client, 'single', parseInt(new_badge))[1]
            
            // Salvando os dados novamente para a reescrita
            user.fixed_badge = new_badge
            user.badge_list = badge_list

            writeFileSync(`./arquivos/data/badges/${user.id}/badges.json`, JSON.stringify(user))
            delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}/badges.json`)]

            interaction.reply({ content: `${emoji_badge} | Badge \`${nome_badge}\` ${diversao[9]["badge_fixada"]}`, ephemeral: true })
        }
    }
}