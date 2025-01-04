const { getModule } = require('../../../database/schemas/User_modules')

module.exports = async ({ client, user, interaction, dados }) => {

    const timestamp = parseInt(dados.split(".")[2])
    const data = parseInt(dados.split(".")[1])

    const modulo = await getModule(interaction.user.id, timestamp)

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [row],
            flags: "Ephemeral"
        })

    modulo.data = data
    await modulo.save()

    require('./modules')({ client, user, interaction, dados })
}