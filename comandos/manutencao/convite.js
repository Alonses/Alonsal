const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_buttons = require('../../adm/discord/create_buttons')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invitation')
        .setNameLocalizations({
            "pt-BR": 'convite',
            "es-ES": 'invitacion',
            "fr": 'invitation',
            "it": 'invito'
        })
        .setDescription('⌠📡⌡ Invite Alonsal right now!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Convide o Alonsal agora mesmo!',
            "es-ES": '⌠📡⌡ ¡Invita a Alonsal ahora mismo!',
            "fr": '⌠📡⌡ Invitez Alonsal maintenant!',
            "it": '⌠📡⌡ Invita Alonsal ora!'
        }),
    async execute(client, user, interaction) {

        const row = create_buttons([{ name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=1614150720` }], interaction)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(client.tls.phrase(user, "manu.convite.titulo"))
            .setDescription(client.tls.phrase(user, "manu.convite.convite"))

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}