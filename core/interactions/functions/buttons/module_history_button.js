const { getModule } = require('../../../database/schemas/Module')

module.exports = async ({ client, user, interaction, dados }) => {

    const hash = dados.split(".")[2]
    const modulo = await getModule(hash)

    if (!modulo)
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [row],
            flags: "Ephemeral"
        })

    modulo.data = parseInt(dados.split(".")[1])
    await modulo.save()

    dados = `${interaction.user.id}.${hash}`
    require('../../chunks/verify_module')({ client, user, interaction, dados })
}