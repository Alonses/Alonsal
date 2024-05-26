const { getGuildWarn } = require('../../../database/schemas/Guild_warns')

module.exports = async ({ client, user, interaction, dados }) => {

    const id_warn = parseInt(dados.split(".")[1])
    const strikes = parseInt(dados.split(".")[0])

    const warn = await getGuildWarn(interaction.guild.id, id_warn)
    warn.strikes = strikes

    await warn.save()

    // Redirecionando o evento
    dados = `x.y.${id_warn}`
    require('../../chunks/warn_configure')({ client, user, interaction, dados })
}