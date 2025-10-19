module.exports = async ({ client, data }) => {

    const { id_guild, user } = data

    // Updates the user's default language if they do not have one
    const guild = await client.getGuild(id_guild)
    user.lang = guild.lang ?? "pt-br"
    await user.save()
}