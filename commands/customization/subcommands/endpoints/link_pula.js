module.exports = async ({ client, user, interaction }) => {

    user.social.pula_predios = interaction.options.getString("value")
    await user.save()

    client.tls.reply(interaction, user, "util.lastfm.new_link", true, client.emoji("emojis_dancantes"), ["pula", "</pula:1023486895327555584>"])
}