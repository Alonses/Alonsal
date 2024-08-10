const { getGuildStrike, updateGuildStrike} = require('../../../database/schemas/Guild_strikes')

module.exports = async ({ client, interaction, dados }) => {

    const tempo_mute = parseInt(dados.split(".")[0])
    const id_strike = parseInt(dados.split(".")[1])

    // Atualizando o tempo de expiração do cargo vinculado ao strike
    const strike = await getGuildStrike(client, interaction.guild.id, id_strike)
    await updateGuildStrike(client, strike.id, { timed_role_timeout: tempo_mute })

    // Redirecionando o evento
    dados = `x.y.${id_strike}`
    await require('../../chunks/strike_configure')({client, interaction, dados})
}