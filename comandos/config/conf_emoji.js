const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/funcoes/busca_emoji.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_emojis')
		.setDescription('⌠🤖⌡ Lista todos os emojis conhecidos')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
	async execute(client, interaction) {
    
        if (!client.owners.includes(interaction.user.id)) return
        
        let emojis_registrados = "", emojis_registrados_2 = "", i = 0

        Object.keys(emojis).forEach(emoji => {
            if ((emojis_registrados + busca_emoji(client, emojis[emoji])).length < 2000) {
                if (i % 9 == 0)
                    emojis_registrados += "\n"

                emojis_registrados += busca_emoji(client, emojis[emoji])
            } else {
                if ((emojis_registrados_2 + busca_emoji(client, emojis[emoji])).length < 2000) {
                    if (i % 9 == 0)
                        emojis_registrados_2 += "\n"

                    emojis_registrados_2 += busca_emoji(client, emojis[emoji])
                }
            }

            i++
        })

        const emojis_global = new EmbedBuilder()
        .setTitle("Todos os emojis registrados")
        .setColor(0x29BB8E)
        .setDescription(emojis_registrados)
        .setFooter({ text: `Quantidade: ${Object.keys(emojis).length}` })

        if (emojis_registrados_2.length < 1)
            interaction.reply({embeds: [emojis_global]})

        if (emojis_registrados_2.length > 0) {
            const emojis_global2 = new EmbedBuilder()
            .setTitle("Todos os emojis registrados")
            .setColor(0x29BB8E)
            .setDescription(emojis_registrados_2)
            .setFooter({ text: `Quantidade: ${Object.keys(emojis).length}` })

            interaction.channel.send({embeds: [emojis_global2]})
            interaction.reply({ embeds: [emojis_global] })
        }
    }
}