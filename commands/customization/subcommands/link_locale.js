module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({ ephemeral: true })

    user.misc.locale = interaction.options.getString("value")

    // Verificando se o local existe antes de salvar
    await fetch(`${process.env.url_weather}appid=${process.env.key_weather}&q=${user.misc.locale}&units=metric&lang=pt`)
        .then(response => response.json())
        .then(async res => {

            if (res.cod === '404')
                return interaction.editReply({
                    content: client.tls.phrase(user, "util.tempo.sem_local", 1),
                    ephemeral: true
                })

            await user.save()

            interaction.editReply({
                content: client.replace(client.tls.phrase(user, "util.tempo.new_link", client.emoji("emojis_dancantes")), user.misc.locale),
                ephemeral: true
            })
        })
}