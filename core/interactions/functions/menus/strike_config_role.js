const { getGuildStrike } = require('../../../database/schemas/Guild_strikes')

module.exports = async ({ client, user, interaction, dados }) => {

    let cargo = dados.split(".")[0]
    const id_strike = parseInt(dados.split("/")[1])

    // Atualizando o cargo do strike
    const strike = await getGuildStrike(interaction.guild.id, id_strike)
    strike.role = cargo === "none" ? null : cargo

    // Desativando o cargo temporário caso seja removido o cargo do Strike
    if (!strike.role) strike.timed_role.status = false

    await strike.save()

    // Redirecionando o evento
    dados = `x.y.${id_strike}`
    require('../../chunks/strike_configure')({ client, user, interaction, dados })
}