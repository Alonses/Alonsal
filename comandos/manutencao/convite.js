const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const create_buttons = require('../../adm/funcoes/create_buttons')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invitation')
        .setNameLocalizations({
            "pt-BR": 'convite',
            "fr": 'invitation'
        })
		.setDescription('⌠📡⌡ Invite Alonsal right now!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Convide o Alonsal agora mesmo!',
            "fr": '⌠📡⌡ Invitez Alonsal maintenant!'
        }),
	async execute(client, interaction) {

        const { manutencao, updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const row = create_buttons([{name: updates[0]["convidar"], type: 4, value: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720`}])

        const embed = new EmbedBuilder()
        .setColor(0x29BB8E)
        .setTitle(manutencao[0]["titulo"])
        .setDescription(manutencao[0]["convite"])
        
        interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    }
}