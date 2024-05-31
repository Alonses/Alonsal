const { getGuildStrike } = require('../../../database/schemas/Guild_strikes')

module.exports = async ({ client, user, interaction, dados }) => {

    let acao = dados.split(".")[0]
    const id_strike = parseInt(dados.split(".")[1])

    // Atualizando a punição do strike
    const strike = await getGuildStrike(interaction.guild.id, id_strike)
    strike.action = acao === "none" ? null : acao

    await strike.save()

    // Redirecionando o evento
    dados = `x.y.${id_strike}`
    require('../../chunks/strike_configure')({ client, user, interaction, dados })
}