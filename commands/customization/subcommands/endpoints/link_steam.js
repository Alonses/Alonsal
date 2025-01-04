module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({ ephemeral: true })

    // Verificando se o local existe antes de salvar
    await fetch(`https://steamcommunity.com/id/${interaction.options.getString("value")}`)
        .then(response => response.text())
        .then(async res => {

            if (res.includes("The specified profile could not be found."))
                return interaction.editReply({
                    content: client.tls.phrase(user, "util.steam.nome_invalido", 1),
                    ephemeral: true
                })

            user.social.steam = client.encrypt(interaction.options.getString("value"))
            await user.save()

            interaction.editReply({
                content: client.tls.phrase(user, "util.lastfm.new_link", client.emoji("emojis_dancantes"), ["steam", "</steam:1018609879562334384>"]),
                ephemeral: true
            })
        })
}