const { getModule } = require("../../../database/schemas/Module")

module.exports = async ({ client, user, interaction, dados }) => {

    const hash = dados.split(".")[1]

    // Alterando o dia do módulo
    const modulo = await getModule(hash)
    modulo.stats.days = parseInt(dados.split(".")[2])

    await modulo.save()

    // Redirecionando o evento
    require('../../chunks/verify_module')({ client, user, interaction, dados })
}