const { getGuildWarn } = require('../../../database/schemas/Guild_warns')

module.exports = async ({ client, user, interaction, dados }) => {

    let cargo = dados.split(".")[0]
    const id_warn = parseInt(dados.split("/")[1])

    // Atualizando o cargo da advertência
    const warn = await getGuildWarn(interaction.guild.id, id_warn)
    warn.role = cargo == "none" ? null : cargo

    await warn.save()

    // Redirecionando o evento
    dados = `x.y.${id_warn}`
    require('../../chunks/warn_configure')({ client, user, interaction, dados })
}