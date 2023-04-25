const { getModule } = require('../../../database/schemas/Module')

module.exports = async ({ client, user, interaction, dados }) => {

    const timestamp = parseInt(dados.split(".")[2])
    const data = parseInt(dados.split(".")[1])

    const modulo = await getModule(interaction.user.id, timestamp)

    modulo.data = data
    await modulo.save()

    require('./modules')({ client, user, interaction, dados })
}