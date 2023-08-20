module.exports = async ({ client, user, interaction, channel }) => {

    channel.permissionOverwrites.edit(
        interaction.guild.id,
        {
            SendMessages: false,
            ViewChannel: true,
            ReadMessageHistory: true,
            CreatePublicThreads: false,
            CreatePrivateThreads: false
        }
    )

    client.tls.reply(interaction, user, "mode.canal.lock", true, client.defaultEmoji("guard"))
}