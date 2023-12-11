const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setNameLocalizations({
            "de": 'einladen',
            "es-ES": 'invitacion',
            "fr": 'invitation',
            "it": 'invito',
            "pt-BR": 'convite',
            "ru": 'пригласить',
        })
        .setDescription("⌠📡⌡ Invite Alon right now!")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Jetzt Alon einladen!',
            "es-ES": '⌠📡⌡ ¡Invita a Alon ahora mismo!',
            "fr": '⌠📡⌡ Invitez Alon maintenant!',
            "it": '⌠📡⌡ Invita Alon ora!',
            "pt-BR": '⌠📡⌡ Convide o Alon agora mesmo!',
            "ru": '⌠📡⌡ Пригласите Алонсала прямо сейчас!'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=2550136990` }
        ], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.convite.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/N8AFVTH.png")
            .setDescription(client.tls.phrase(user, "manu.convite.convite"))

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}