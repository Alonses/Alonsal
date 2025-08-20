const { SlashCommandBuilder } = require('discord.js')

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
        .setDescription("⌠📡⌡ Invite Alonsal right now!")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Jetzt Alonsal einladen!',
            "es-ES": '⌠📡⌡ ¡Invita a Alonsal ahora mismo!',
            "fr": '⌠📡⌡ Invitez Alonsal maintenant!',
            "it": '⌠📡⌡ Invita Alonsal ora!',
            "pt-BR": '⌠📡⌡ Convide o Alonsal agora mesmo!',
            "ru": '⌠📡⌡ Пригласите Алонсала прямо сейчас!'
        }),
    async execute({ client, user, interaction }) {

        const row = client.create_buttons([
            { name: { tls: "inic.inicio.convidar" }, type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=2550136990` }
        ], interaction, user)

        const embed = client.create_embed({
            title: { tls: "manu.convite.titulo" },
            image: "https://i.imgur.com/N8AFVTH.png",
            description: { tls: "manu.convite.convite" }
        }, user)

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}