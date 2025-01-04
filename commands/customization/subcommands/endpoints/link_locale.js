module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({ flags: "Ephemeral" })

    // Verificando se o local existe antes de salvar
    await fetch(`${process.env.url_weather}appid=${process.env.key_weather}&q=${interaction.options.getString("value")}&units=metric&lang=pt`)
        .then(response => response.json())
        .then(async res => {

            if (res.cod === '404')
                return interaction.editReply({
                    content: client.tls.phrase(user, "util.tempo.sem_local", 1),
                    flags: "Ephemeral"
                })

            user.misc.locale = client.encrypt(interaction.options.getString("value"))
            await user.save()

            interaction.editReply({
                content: client.tls.phrase(user, "util.tempo.new_link", client.emoji("emojis_dancantes"), interaction.options.getString("value")),
                flags: "Ephemeral"
            })
        })
}