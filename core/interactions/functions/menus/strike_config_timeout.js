const { getGuildStrike } = require('../../../database/schemas/Guild_strikes')

module.exports = async ({ client, user, interaction, dados }) => {

    const tempo_mute = parseInt(dados.split(".")[0])
    const id_strike = parseInt(dados.split(".")[1])

    // Atualizando o tempo de mute do strike
    const strike = await getGuildStrike(interaction.guild.id, id_strike)
    strike.timeout = tempo_mute

    await strike.save()

    // Redirecionando o evento
    dados = `x.y.${id_strike}`
    require('../../chunks/strike_configure')({ client, user, interaction, dados })
}