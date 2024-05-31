const { getGuildStrike } = require('../../../database/schemas/Guild_strikes')

module.exports = async ({ client, user, interaction, dados }) => {

    let cargo = dados.split(".")[0]
    const id_strike = parseInt(dados.split("/")[1])

    // Removendo o cargo
    if (cargo == "none") cargo = null

    // Atualizando o cargo do strike
    const strike = await getGuildStrike(interaction.guild.id, id_strike)
    strike.role = cargo

    await strike.save()

    // Redirecionando o evento
    dados = `x.y.${id_strike}`
    require('../../chunks/strike_configure')({ client, user, interaction, dados })
}