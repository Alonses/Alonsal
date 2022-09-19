const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const create_buttons = require('../../adm/discord/create_buttons')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invitation')
        .setNameLocalizations({
            "pt-BR": 'convite',
            "es-ES": 'invitacion',
            "fr": 'invitation'
        })
        .setDescription('⌠📡⌡ Invite Alonsal right now!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Convide o Alonsal agora mesmo!',
            "es-ES": '⌠📡⌡ ¡Invita a Alonsal ahora mismo!',
            "fr": '⌠📡⌡ Invitez Alonsal maintenant!'
        }),
    async execute(client, interaction) {

        const { manutencao, updates } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const row = create_buttons([{ name: updates[0]["convidar"], type: 4, value: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720` }])
        const user = client.custom.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setTitle(manutencao[0]["titulo"])
            .setDescription(manutencao[0]["convite"])

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}