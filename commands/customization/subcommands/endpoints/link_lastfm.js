module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({ flags: "Ephemeral" })

    // Verificando se o local existe antes de salvar
    await fetch(`https://www.last.fm/pt/user/${interaction.options.getString("value")}`)
        .then(response => response.text())
        .then(async res => {

            if (res.includes("Página não encontrada"))
                return client.tls.editReply(interaction, user, "util.lastfm.error_1", true, 1)

            user.social.lastfm = client.encrypt(interaction.options.getString("value"))
            await user.save()

            interaction.editReply({
                content: client.tls.phrase(user, "util.lastfm.new_link", client.emoji("emojis_dancantes"), ["lastfm", "</lastfm:1018609879512006796>"]),
                flags: "Ephemeral"
            })
        })
}