const { getModule } = require('../../../database/schemas/Module')

module.exports = async ({ client, user, interaction, dados }) => {

    // Atualizando o canal de aviso do módulo do servidor
    const hash = dados.split(".")[1]

    const modulo = await getModule(hash)
    modulo.misc.cid = client.encrypt(dados.split(".")[0])

    await modulo.save()

    dados = `${interaction.user.id}.${hash}`
    require('../../chunks/verify_module')({ client, user, interaction, dados })
}