const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('convite')
		.setDescription('⌠📡⌡ Convide o Alonsal agora mesmo!'),
	async execute(client, interaction) {

        const { manutencao, updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(updates[0]["convidar"])
                .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720`)
                .setStyle(ButtonStyle.Link),
            )

        const embed = new EmbedBuilder()
        .setColor(0x29BB8E)
        .setTitle(manutencao[0]["titulo"])
        .setDescription(manutencao[0]["convite"])
        
        interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    }
}