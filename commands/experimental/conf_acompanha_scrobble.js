const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { acompanha_scrobble } = require('../../core/events/presence')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_scrobble")
        .setDescription("⌠🤖⌡ Faça o Alonsal acompanhar seus Scrobbles no LastFM")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        return

        if (!client.owners.includes(interaction.user.id)) return

        acompanha_scrobble(client, user.social.lastfm)

        interaction.reply({
            content: `${client.emoji("emojis_dancantes")} | O ${client.username()} agora está acompanhando os seus Scrobbles\nPare de ouvir as músicas por alguns segundos para desligar o acompanhamento.`,
            ephemeral: true
        })

        client.notify(process.env.channel_feeds, { content: `:radio: | O ${client.username()} agora está acompanhando os Scrobbles de ${interaction.user}.` })
    }
}