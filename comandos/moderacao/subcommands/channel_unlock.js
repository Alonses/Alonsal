module.exports = async ({ client, user, interaction, channel }) => {

    channel.permissionOverwrites.edit(
        interaction.guild.id,
        {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true,
            CreatePublicThreads: true,
            CreatePrivateThreads: true
        }
    )

    client.tls.reply(interaction, user, "mode.canal.unlock", true, client.defaultEmoji("guard"))
}