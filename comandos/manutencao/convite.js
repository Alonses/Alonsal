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

        const row = create_buttons([{ name: client.tls.phrase(client, interaction, "inic.inicio.convidar"), type: 4, value: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720` }], interaction)
        const user = client.usuarios.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(user.misc.embed)
            .setTitle(client.tls.phrase(client, interaction, "manu.convite.titulo"))
            .setDescription(client.tls.phrase(client, interaction, "manu.convite.convite"))

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}