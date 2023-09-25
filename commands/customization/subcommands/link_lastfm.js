module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({
        ephemeral: true
    })

    user.social.lastfm = interaction.options.getString("value")

    // Verificando se o local existe antes de salvar
    await fetch(`https://steamcommunity.com/id/${user.social.lastfm}`)
        .then(response => response.text())
        .then(async res => {

            if (res.includes("The specified profile could not be found."))
                return interaction.editReply({
                    content: client.tls.phrase(user, "util.lastfm.error_1", 1),
                    ephemeral: true
                })

            await user.save()

            interaction.editReply({
                content: client.replace(client.tls.phrase(user, "util.lastfm.new_link", client.emoji("emojis_dancantes")), ["lastfm", "</lastfm:1018609879512006796>"]),
                ephemeral: true
            })
        })
}