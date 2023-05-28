const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setNameLocalizations({
            "pt-BR": 'convite',
            "es-ES": 'invitacion',
            "fr": 'invitation',
            "it": 'invito'
        })
        .setDescription("⌠📡⌡ Invite Alonsal right now!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Convide o Alonsal agora mesmo!',
            "es-ES": '⌠📡⌡ ¡Invita a Alonsal ahora mismo!',
            "fr": '⌠📡⌡ Invitez Alonsal maintenant!',
            "it": '⌠📡⌡ Invita Alonsal ora!',
            "ru": '⌠📡⌡ Пригласите Алонсала прямо сейчас!'
        }),
    async execute(client, user, interaction) {

        const row = client.create_buttons([{ name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, emoji: client.emoji(emojis.mc_coracao), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=1614150720` }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.convite.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setImage("https://i.imgur.com/NqmwCA9.png")
            .setDescription(client.tls.phrase(user, "manu.convite.convite"))

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}