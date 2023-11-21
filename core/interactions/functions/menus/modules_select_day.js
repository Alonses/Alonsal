const { getModule } = require("../../../database/schemas/Module")

module.exports = async ({ client, user, interaction, dados }) => {

    const timestamp = parseInt(dados.split(".")[1])
    const dia = parseInt(dados.split(".")[2])

    // Alterando o dia do módulo
    const modulo = await getModule(interaction.user.id, timestamp)
    modulo.stats.days = dia

    await modulo.save()

    // Redirecionando o evento
    require('../../chunks/verify_module')({ client, user, interaction, dados })
}